import { Controller, Body, Post, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private _authService: AuthService) { }

	@Post('login')
	async login(@Body() body,) {
		return await this._authService.login(body)
	}
}
