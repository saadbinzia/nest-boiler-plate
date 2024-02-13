import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private _authService: AuthService) { }

	/**
	 * User login.
	 * @param {AuthDto} body
	 * @returns {object}
	 */
	@Post('login')
	async login(@Body() body: AuthDto): Promise<object> {
		return await this._authService.login(body)
	}
}
