import { Controller, Body, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('admin/auth')
export class AuthController {
	constructor(private _authService: AuthService) { }

	@Post('login')
	async login(@Body() body, @Res() res) {
		return res.json(await this._authService.login(body))
	}

	@Post('logout')
	async logout(@Body() body, @Res() res) {
		return res.json({status: 'success', message: 'Logout successful'})
	}

}
