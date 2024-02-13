import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { v1 as uuidv1 } from 'uuid';
import { BaseService } from 'src/core/base/base.service';
import { MailService } from 'src/modules/mail/mail.service';
import { User } from 'src/entities';
import { VerificationLinkDTO } from './dto/verificationLink.dto';
import { ForgetPasswordDTO } from './dto/forgetPassword.dto';
import GlobalResponses from 'src/core/config/GlobalResponses';


@Injectable()
export class UserService extends BaseService
{
	constructor (
		@Inject(forwardRef(() => MailService))
		private _mailService: MailService,
		private _globalResponses: GlobalResponses
	)
	{
		super(User);
	}

	async findByEmail (email: string)
	{
		return this.findOne({ email: email.toLowerCase() });
	}

	/**
	 * 
	 * @param {VerificationLinkDTO} payload
	 * @returns {any}
	 */
	async createVerificationLink (payload: VerificationLinkDTO): Promise<any>
	{

		let response = this._globalResponses.formatResponse('error', null, null);

		if (payload.email && payload.companyName)
		{

			const fields = {
				...payload,
				email: payload.email.toLowerCase(),
				verificationLink: await this.generateVerificationLink(),
				role: 'user',
				registrationStatus: 'account_created',
			};
			const user = await this.create(fields);


			this._mailService.sendEmail('signup-confirmation', user.email, null, 'Verify your account', {
				name: user.firstName,
				logoImage: `${process.env['API_URL']}/static/email/logo.png`,
				url: `${process.env['APP_URL']}/sign-up?uid=${user.verificationLink}`
			});

			console.log(`${process.env['APP_URL']}/sign-up?uid=${user.verificationLink}`);

			response = user ?
			
				this._globalResponses.formatResponse('success', user.email, 'action_success', { input: 'User', action: 'created' }):
				this._globalResponses.formatResponse('error', null, null);
		}
		else
		{
			response = this._globalResponses.formatResponse('error', null, 'invalid', { input: 'credentials' });
		}

		return response;
	}

	/**
	 * Find user 
	 * @param {number} id
	 * @returns {object}
	 */
	async find (id: number): Promise<object>
	{
		const user = await this.findOne(
			{ id: id },
			null,
			['id']);

		return user ?
			this._globalResponses.formatResponse('success', user, 'action_success', { input: 'User', action: 'found' }):
			this._globalResponses.formatResponse('error', null, 'not_found', { input: 'User' });
	}

	/**
	 * Update user record
	 * @param {number} id
	 * @param {UserDTO} payload
	 * @returns {object}
	 */
	async updateUser (id: number, payload: any): Promise<object>
	{
		let response = this._globalResponses.formatResponse('error', null, null);
		const userExist = await this.findOne({ email: payload.email, id: { [Op.not]: id } });
		if (userExist)
		{
			response = this._globalResponses.formatResponse('error', null, 'exists', { input: 'Email' });
		}
		else
		{
			const user = await this.update({ id: id }, payload);
			response = user ?
				this._globalResponses.formatResponse('success', user, 'action_success', { input: 'User', action: 'updated' }):
				this._globalResponses.formatResponse('error', null, null);
		}

		return response;
	}

	/**
	 * generate unique verification link
	 * @returns {string}
	 */
	async generateVerificationLink (): Promise<string>
	{
		const uid = uuidv1();
		const idExist = await this.findOne({ verificationLink: uid });
		if (!idExist)
		{
			return uid;
		}
		else
		{
			return this.generateVerificationLink();
		}
	}

	/**
	 * Send forgot password email
	 * @param {ForgetPasswordDTO} body
	 * @returns {object}
	 */
	async forgotPassword (body: ForgetPasswordDTO): Promise<object>
	{
		const user = await this.findOne({ email: body.email });

		if (user)
		{
			const resetPasswordCode = uuidv1();
			await this.update({ email: body.email }, { resetPasswordCode });

			const resetPasswordLink = `${process.env['APP_URL']}/reset-password/${resetPasswordCode}`;
			console.log(resetPasswordLink);
			return this._globalResponses.formatResponse('success', user, 'email_sent');
		}
		else
		{
			return this._globalResponses.formatResponse('error', null, 'not_found', { input: 'user' });
		}
	}

	/**
	 * Verify user reset password code 
	 * @param {String} resetCode
	 * @returns {object}
	 */
	async verifyResetPasswordCode (resetCode: string): Promise<object>
	{

		const user = await this.findOne({ resetPasswordCode: resetCode });
		if (user)
		{
			this._globalResponses.formatResponse('success', user, 'action_success', { input: 'Code', action: 'verified' });
		}
		else
		{
			return this._globalResponses.formatResponse('error', null, 'expired', { input: 'The link' });
		}
	}
}
