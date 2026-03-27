import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";

const { RESPONSE_STATUSES } = GlobalEnums;

@Injectable()
export class CronService {
  constructor(private readonly _globalResponses: GlobalResponses) {}

  async hourlyCron(req: Request): Promise<ApiResponse> {
    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      "Hourly cron job executed successfully",
      "hourly_cron_job_executed",
    );
  }
}
