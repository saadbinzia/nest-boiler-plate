import { Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import * as fs from 'fs';

@Controller('')
export class ImagesController {
  constructor() { }

  @Get('uploads/*')
  async findUploads(@Req() req, @Res() res, @Param() param) {
    try {
      let path = __dirname + '/../../../' + req.path.substr(1)
      if (fs.existsSync(path)) {
        res.sendfile(req.path.substr(1))
      } else {
        res.sendfile('/assets/no-image.png')
      }

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }

  @Get('static/*')
  async findStatic(@Req() req, @Res() res, @Param() param) {
    try {

      // let path = __dirname + '/../../../assets/' + req.path.substr(1)
      let path = __dirname + '/../../../' + req.path.substr(1)

      if (fs.existsSync(path)) {
        res.sendfile(req.path.substr(1))
      } else {
        res.sendfile('assets/no-image.png')
      }

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }

  @Get('videos/*')
  async findVideos(@Req() req, @Res() res, @Param() param) {
    try {

      let path = __dirname + '/../../../' + req.path.substr(1)
      if (fs.existsSync(path)) {
        res.sendfile(req.path.substr(1))
      }

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }
}