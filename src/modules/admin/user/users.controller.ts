import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('admin/users')
export class UsersController {
  constructor(private readonly _userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createUser(@Req() req, @Res() res, @Body() body) {
    try {

      return res.json(await this._userService.createUser(body, req.user.id))

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async list(@Res() res, @Body() body) {
    try {

      return res.json(await this._userService.list(body))

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('find/:id')
  async findUser(@Res() res, @Param() param) {
    try {

      return res.json(await this._userService.findUser(param.id))

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateUser(@Res() res, @Req() req, @Param() param) {
    try {

      return res.json(await this._userService.updateUser(req.body, param.id, req.user.id))

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }
}