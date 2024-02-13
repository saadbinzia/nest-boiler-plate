import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import GlobalResponses from 'src/core/config/GlobalResponses';
import { DoesUserExist } from 'src/core/guards/doesUserExists.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ForgetPasswordDTO } from './dto/forgetPassword.dto';
import { UserDTO } from './dto/user.dto';
import { VerificationLinkDTO } from './dto/verificationLink.dto';
import { VerifyResetPasswordCodeDTO } from './dto/verifyResetPassword.dto';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly _userService: UserService,
    private readonly _globalResponses: GlobalResponses
    ) { }

  /**
   * Create user verification link.
   * @param {Response} res
   * @param {VerificationLinkDTO} payload
   * @returns {JSON}
   */
  @UseGuards(DoesUserExist)
  @Post('create-verification-link')
  async createVerificationLink(@Res() res, @Body() payload: VerificationLinkDTO) {
    try {
      return res.json(await this._userService.createVerificationLink(payload));
    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }

  /**
   * Find users on given condition.
   * @param {Response} res
   * @param {Object} payload
   * @returns {JSON}
   */
  @Post('')
  async findAll(@Res() res, @Body() payload) {
    try {

      return res.json(await this._userService.findAll(payload));

    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }

  /**
   * Find user by id.
   * @param {Response} res
   * @param {Request} req
   * @returns {JSON}
   */
  @UseGuards(JwtAuthGuard)
  @Get('find')
  async find(@Res() res, @Req() req) {
    try {

      // Need to check this line (req.user.id) : un-tested
      return res.json(await this._userService.find(req.user.id))

    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }

  /**
   * Update user record.
   * @param {Response} res
   * @param {UserDTO} payload
   * @param {Object} param
   * @returns {JSON}
   */
  @Put('update/:id')
  async updateUser(@Res() res, @Body() payload: UserDTO, @Param() param) {
    try {

      return res.json(await this._userService.updateUser(param.id, payload))

    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }

  /**
   * Used to get reset password link.
   * @param {Request} res
   * @param {ForgetPasswordDTO} body
   * @returns {JSON}
   */
  @Post('forgot-password')
  async forgotPassword(@Res() res, @Body() body: ForgetPasswordDTO) {
    try {

      return res.json(await this._userService.forgotPassword(body))

    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }

  /**
   * Verify user reset password code.
   * @param {Response} res
   * @param {VerifyResetPasswordCodeDTO} param
   * @returns {JSON}
   */
  @Get('verify-reset-password-code/:resetCode')
  async verifyResetPasswordCode(@Res() res: any, @Param() param: VerifyResetPasswordCodeDTO) {
    try {

      return res.json(await this._userService.verifyResetPasswordCode(param.resetCode))

    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }
}