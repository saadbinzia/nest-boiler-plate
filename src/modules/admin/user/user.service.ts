import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { BaseService } from 'src/core/base/base.service';
import { User } from 'src/entities';
import { UserService as AppUserService } from 'src/modules/app/user/user.service';

@Injectable()
export class UserService extends BaseService {

  constructor(
    // @Inject(forwardRef(() => AppUserService))
    // private _appUserService: AppUserService,
  ) {
    super(User)
  }

  /**
   * Create user from admin panel
   * @param payload any
   * @param adminId number
   */
  async createUser(payload: any, adminId: number) {
    let userExist = await this.findOne({ email: payload.email.toLowerCase() })
    if (userExist) {
      return { status: 'error', message: 'Email already exist' };
    }
    else {

      const fields = {
        ...payload,
        createdBy: adminId
      }
      const user = await this.create(fields);
      return user ?
        { status: 'success', data: user, message: 'user created successfully' } :
        { status: 'error', data: null, message: 'Something went wrong' };
    }
  }

  /**
   * Get list of users
   * @param payload any
   * @returns object
   */
  async list(payload: any) {
    let users = await this.findAll(
      { role: { [Op.not]: 'admin' } },
      [payload.sort.split(' ')],
      null,
      ['id', 'firstName', 'lastName', 'email', 'status', 'createdAt'],
      (payload.page - 1) * payload.limit,
      payload.limit,
    )
    let totalCount = await this.count({ role: { [Op.not]: 'admin' } })

    return { status: 'success', data: { users, count: totalCount } }
  }

  /**
   * Get user by id
   * @param userId number
   * @returns object
   */
  async findUser(userId: number) {
    let user = await this.findOne(
      { id: userId },
      null,
      ['id', 'firstName', 'lastName', 'email', 'status', 'createdAt', 'registrationStatus', 'phoneNumber', 'profilePic']
    )

    return user ? { status: 'success', data: user } : { status: 'error', data: user }
  }

  /**
   * Update user by id
   * @param body any
   * @param userId number
   * @param adminId number
   * @returns object
   */
  async updateUser(body: any, userId: number, adminId: number) {
    const userExist = await this.findOne({ email: body.email.toLowerCase(), id: { [Op.not]: userId } });
    if (userExist) {
      return { status: 'error', data: null, message: 'email already exist' }
    }
    else {
      let user = await this.updateOne(
        { id: userId },
        {
          ...body,
          updatedBy: adminId
        }
      )
      return user[0] ? { status: 'success', data: user } : { status: 'error', data: user }
    }
  }
}
