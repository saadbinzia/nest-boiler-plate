import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/app/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import GlobalResponses from 'src/core/config/GlobalResponses';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly _userService: UserService,
		private readonly _jwtService: JwtService,
		private _globalResponses: GlobalResponses
	) { }

	/**
	 * Login user on app end
	 * @param {any} payload
	 * @returns {object}
	 */
	public async login(payload: any): Promise<object> {
		return await this.validateUser(payload.email, payload.password);
	}

	/**
	 * Validate credentials and generate token
	 * @param {string} email
	 * @param {string} pass
	 * @returns {object}
	 */
	async validateUser(email: string, pass: string): Promise<object> {
		try {
			const user = await this._userService.findOne({ email: email, role: { [Op.not]: 'admin'} });
			if (!user) {
				return this._globalResponses.formatResponse('error', null, 'not_found', { input: 'User' });
			}
			const match = await this.comparePassword(pass, user.password);
			if (!match) {
				return this._globalResponses.formatResponse('error', null, 'invalid', { input: 'credentials' });
			}
			const token = await this.generateToken({ id: user.id, email: user.email });
			const result = user['dataValues'];
			delete result.password

			return this._globalResponses.formatResponse('success', { token: token, user: result }, 'default')
		} catch (error) {
			return this._globalResponses.formatResponse('error', null, null);
		}
	}

	/**
	 * Compare entered and db password(encrypted) using bcrypt
	 * @param {string} enteredPassword
	 * @param {string} passwordInDatabase
	 * @returns {boolean}
	 */
	private async comparePassword(enteredPassword: string, passwordInDatabase: string): Promise<boolean> {
		const match = await bcrypt.compare(enteredPassword, passwordInDatabase);
		return match;
	}

	/**
	 * Generate JWT token
	 * @param {any} user
	 * @returns {string}
	 */
	async generateToken(user: any): Promise<string> {
		const token = await this._jwtService.signAsync(user);
		return token;
	}

}