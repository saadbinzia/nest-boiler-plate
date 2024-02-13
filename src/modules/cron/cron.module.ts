import { Module } from '@nestjs/common';
import { CronsController } from './crons.controller';
import { CronService } from './cron.service';
import GlobalResponses from 'src/core/config/GlobalResponses';

@Module({
  imports: [
  ],
  controllers: [
    CronsController,
  ],
  providers: [
    CronService,
    GlobalResponses
  ],
  exports: [CronService]
})
export class CronModule { }
