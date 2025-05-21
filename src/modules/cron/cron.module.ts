import { Module } from "@nestjs/common";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { CronService } from "./cron.service";
import { CronsController } from "./crons.controller";

@Module({
  imports: [],
  controllers: [CronsController],
  providers: [CronService, GlobalResponses, HelperService],
  exports: [CronService],
})
export class CronModule {}
