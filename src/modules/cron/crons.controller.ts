import { Controller, Get, Query, Res } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronDTO } from './dto/cron.dto';
import GlobalResponses from 'src/core/config/GlobalResponses';

@Controller('crons')
export class CronsController {
  constructor(
    private readonly _cronService: CronService,
    private readonly _globalResponses: GlobalResponses
  ) { }

  /**
   * Get cron job record.
   * @param {Response} res
   * @param {CronDTO} query
   * @returns {JSON}
   */
  @Get('')
  async cronJob(@Res() res, @Query() query: CronDTO) {
    try {

      return res.json(query?.key === process.env['CRON_KEY'] ? await this._cronService.cronJob() : this._globalResponses.formatResponse('error', null, 'invalid', { input: 'key' }))

    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }

}