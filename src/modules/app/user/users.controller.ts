import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { DoesUserExist } from 'src/core/guards/doesUserExists.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly _userService: UserService
  ) { }

  @UseGuards(DoesUserExist)
  @Post('create-verification-link')
  async createVerificationLink(@Res() res, @Body() payload: any) {
    try {
      return res.json(await this._userService.createVerificationLink(payload));
    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }

  @Post('')
  async findAll(@Res() res, @Body() payload) {
    try {

      return res.json(await this._userService.findAll(payload));

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('find')
  async find(@Res() res, @Req() req) {
    try {

      return res.json(await this._userService.find(req.user.id))

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }

  @Put('update/:id')
  async updateUser(@Res() res, @Body() payload, @Param() param) {
    try {

      return res.json(await this._userService.updateUser(param.id, payload))

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Res() res, @Body() body) {
    try {

      return res.json(await this._userService.forgotPassword(body))

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }

  @Get('verify-reset-password-code/:resetCode')
  async verifyResetPasswordCode(@Res() res: any, @Param() param) {
    try {

      return res.json(await this._userService.verifyResetPasswordCode(param.resetCode))

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }
}