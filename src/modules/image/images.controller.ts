import { Controller, Get, Req, Res } from '@nestjs/common';
import * as fs from 'fs';
import { ImageDTO } from './dto/image.dto';
import GlobalResponses from 'src/core/config/GlobalResponses';

@Controller('')
export class ImagesController {
  constructor(
    private readonly _globalResponses: GlobalResponses
  ) { }

  /**
   * Find image if exists.
   * @param {ImageDTO} req
   * @param {Response} res
   * @returns {JSON}
   */
  @Get('uploads/*')
  async findUploads(@Req() req: ImageDTO, @Res() res) {
    try {
      const path = __dirname + '/../../../' + req.path.substr(1)
      if (fs.existsSync(path)) {
        res.sendfile(req.path.substr(1))
      } else {
        res.sendfile('/assets/no-image.png')
      }

    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }

  /**
   * Find image if exists.
   * @param {ImageDTO} req
   * @param {Response} res
   * @returns {JSON}
   */
  @Get('static/*')
  async findStatic(@Req() req: ImageDTO, @Res() res) {
    try {

      // let path = __dirname + '/../../../assets/' + req.path.substr(1)
      const path = __dirname + '/../../../' + req.path.substr(1)

      if (fs.existsSync(path)) {
        res.sendfile(req.path.substr(1))
      } else {
        res.sendfile('assets/no-image.png')
      }

    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }

  /**
   * Find video if exists.
   * @param {ImageDTO} req
   * @param {Response} res
   * @returns {JSON}
   */
  @Get('videos/*')
  async findVideos(@Req() req: ImageDTO, @Res() res) {
    try {

      const path = __dirname + '/../../../' + req.path.substr(1)
      if (fs.existsSync(path)) {
        res.sendfile(req.path.substr(1))
      }

    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }
}