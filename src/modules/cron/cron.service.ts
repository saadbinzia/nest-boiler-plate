import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";

@Injectable()
export class CronService {
  constructor(
    private readonly _globalResponses: GlobalResponses,
  ) {}

  async hourlyCron(req: Request): Promise<ApiResponse> {
    try {
      console.log(req);
    } catch (error) {
      console.error(error);
    }

    return this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.SUCCESS,
      null,
      null,
    );
  }
}
