import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { v1 as uuidv1 } from 'uuid';
import { BaseService } from 'src/core/base/base.service';
import { MailService } from 'src/modules/mail/mail.service';
import { User } from 'src/entities';


@Injectable()
export class UserService extends BaseService {
  constructor(
    @Inject(forwardRef(() => MailService))
    private _mailService: MailService,
  ) {
    super(User)
  }

  async findByEmail(email: string) {
    return this.findOne({ email: email.toLowerCase() });
  }

  /**
   * 
   * @param payload any
   * @returns 
   */
  async createVerificationLink(payload: any): Promise<any> {

    let response = { status: 'error', data: null, message: 'Something went wrong' }

    if (payload.email && payload.companyName) {

      const fields = {
        ...payload,
        email: payload.email.toLowerCase(),
        verificationLink: await this.generateVerificationLink(),
        role: 'user',
        registrationStatus: 'account_created',
      }
      const user = await this.create(fields);


      this._mailService.sendEmail('signup-confirmation', user.email, null, 'Verify your account', {
        name: user.firstName,
        logoImage: `${process.env['API_URL']}/static/email/logo.png`,
        url: `${process.env['APP_URL']}/sign-up?uid=${user.verificationLink}`
      });

      console.log(`${process.env['APP_URL']}/sign-up?uid=${user.verificationLink}`);

      response = user ?
        { status: 'success', data: user.email, message: 'user created successfully' } :
        { status: 'error', data: null, message: 'Something went wrong' };
    }
    else {
      response = { status: 'error', data: null, message: 'Incomplete Credentials' };
    }

    return response
  }

  /**
   * Find user 
   * @param id number
   * @returns object
   */
  async find(id: number): Promise<object> {
    const user = await this.findOne(
      { id: id },
      null,
      ['id']);

    return user ?
      { status: 'success', data: user, message: 'user found' } :
      { status: 'error', data: null, message: 'user not found' }
  }

  /**
   * Update user record
   * @param id number
   * @param payload any
   * @returns object
   */
  async updateUser(id: number, payload: any): Promise<object> {
    let response = { status: 'error', data: null, message: 'Something went wrong' }
    const userExist = await this.findOne({ email: payload.email, id: { [Op.not]: id } });
    if (userExist) {
      response = { status: 'error', data: null, message: 'email already exist' }
    }
    else {
      const user = await this.update({ id: id }, payload)
      response = user ?
        { status: 'success', data: user, message: 'user updated' } :
        { status: 'error', data: null, message: 'Something went wrong' }
    }

    return response
  }

  /**
   * generate unique verification link
   * @returns string
   */
  async generateVerificationLink() {
    const uid = uuidv1();
    const idExist = await this.findOne({ verificationLink: uid })
    if (!idExist) {
      return uid
    }
    else {
      return this.generateVerificationLink()
    }
  }

  /**
   * Send forgot password email
   * @param body any
   * @returns object
   */
  async forgotPassword(body: any): Promise<object> {
    const user = await this.findOne({ email: body.email });

    if (user) {
      let resetPasswordCode = uuidv1()
      await this.update({ email: body.email }, { resetPasswordCode })

      let resetPasswordLink = `${process.env['APP_URL']}/reset-password/${resetPasswordCode}`
      console.log(resetPasswordLink);

      return { status: 'success', data: user, message: 'Email has been sent to the email you provided' };
    }
    else {
      return { status: 'error', data: null, message: 'user not found' };
    }
  }

  /**
   * Verify user reset password code 
   * @param resetCode String
   * @returns Json Object
   */
  async verifyResetPasswordCode(resetCode: string): Promise<any> {

    let user = await this.findOne({ resetPasswordCode: resetCode })
    if (user) {
      return { status: 'success', message: 'Code verified' }
    }
    else {
      return { status: 'error', message: 'The link has been expired' }
    }
  }
}
