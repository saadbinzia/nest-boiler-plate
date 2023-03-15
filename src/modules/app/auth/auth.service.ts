import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/app/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly _userService: UserService,
		private readonly _jwtService: JwtService,
	) { }

	/**
	 * Login user on app end
	 * @param payload any
	 * @returns object
	 */
	public async login(payload: any) {
		return await this.validateUser(payload.email, payload.password);
	}

	/**
	 * Validate credentials and generate token
	 * @param email string
	 * @param pass string
	 * @returns object
	 */
	async validateUser(email: string, pass: string) {
		try {
			const user = await this._userService.findOne({ email: email, role: 'admin' });
			if (!user) {
				return { status: 'error', message: "User not found! please try again" };
			}
			const match = await this.comparePassword(pass, user.password);
			if (!match) {
				return { status: 'error', message: "Invalid credentials" };
			}
			const token = await this.generateToken({ id: user.id, email: user.email });
			const { password, ...result } = user['dataValues'];
			return { status: 'success', data: { token: token, user: result } };
		} catch (error) {
			return { status: 'error', data: error?.response?.data || error?.stack };
		}
	}

	/**
	 * Compare entered and db password(encrypted) using bcrypt
	 * @param enteredPassword string
	 * @param passwordInDatabase string
	 * @returns boolean
	 */
	private async comparePassword(enteredPassword: string, passwordInDatabase: string) {
		const match = await bcrypt.compare(enteredPassword, passwordInDatabase);
		return match;
	}

	/**
	 * Generate JWT token
	 * @param user any
	 * @returns string
	 */
	async generateToken(user) {
		const token = await this._jwtService.signAsync(user);
		return token;
	}

}