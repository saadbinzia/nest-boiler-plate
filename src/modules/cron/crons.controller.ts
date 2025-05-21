import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { CronService } from "./cron.service";
import { CronDTO } from "./dto/cron.dto";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  ErrorResponse,
  SuccessResponse,
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";

@ApiTags("Crons (Not configured yet)")
@Controller("crons")
export class CronsController {
  constructor(
    private readonly _cronService: CronService,
    private readonly _globalResponses: GlobalResponses,
  ) {}

  /**
   * Get cron job record.
   * @param {Request} req
   * @param {Response} res
   * @param {CronDTO} query
   * @returns {JSON}
   */
  @Get("hourly-cron")
  @ApiOperation({
    summary: "hourly Cron",
    description: "Cron that will run every hour",
  })
  @ApiQuery({
    name: "key",
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 422,
    description: "Unprocessable Entity",
    type: UnprocessableResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  async hourlyCron(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: CronDTO,
  ): Promise<object> {
    try {
      const response =
        query?.key === process.env["CRON_KEY"]
          ? await this._cronService.hourlyCron(req)
          : this._globalResponses.formatResponse(
              req,
              GlobalEnums.RESPONSE_STATUSES.ERROR,
              null,
              "invalid_cron_key",
            );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );
      return res.status(response.statusCode).json(response);
    }
  }
}
