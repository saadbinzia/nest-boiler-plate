import { Controller, Get, Req, Res } from "@nestjs/common";
import * as fs from "fs";
import { ImageDTO } from "./dto/image.dto";
import GlobalResponses from "src/core/config/GlobalResponses";
import { GlobalEnums } from "src/core/config/globalEnums";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  ErrorResponse,
  SuccessResponse,
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";

@Controller("")
export class ImagesController {
  constructor(private readonly _globalResponses: GlobalResponses) {}

  /**
   * Find image if exists.
   * @param {ImageDTO} req
   * @param {Response} res
   * @returns {JSON}
   */
  @Get("uploads/*filePath")
  @ApiOperation({
    summary: "File upload",
    description: "File upload.",
  })
  @ApiResponse({
    status: 200,
    description: "File uploaded successfully",
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
  async findUploads(@Req() req: ImageDTO, @Res() res) {
    try {
      const path = __dirname + "/../../../" + req.path.substr(1);
      if (fs.existsSync(path)) {
        res.sendFile(req.path.substr(1), { root: __dirname + "/../../../" });
      } else {
        res.sendFile("assets/no-image.png", { root: __dirname + "/../../../" });
      }
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        null,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );
      return res.status(response.statusCode).json(response);
    }
  }

  /**
   * Find image if exists.
   * @param {ImageDTO} req
   * @param {Response} res
   * @returns {JSON}
   */
  @Get("static/*filePath")
  @ApiOperation({
    summary: "Static files upload",
    description: "Static files upload",
  })
  @ApiResponse({
    status: 200,
    description: "File uploaded successfully",
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
  async findStatic(@Req() req: ImageDTO, @Res() res) {
    try {
      // let path = __dirname + '/../../../assets/' + req.path.substr(1)
      const path = __dirname + "/../../../" + req.path.substr(1);

      if (fs.existsSync(path)) {
        res.sendFile(req.path.substr(1), { root: __dirname + "/../../../" });
      } else {
        res.sendFile("assets/no-image.png", { root: __dirname + "/../../../" });
      }
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        null,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );
      return res.status(response.statusCode).json(response);
    }
  }

  /**
   * Find video if exists.
   * @param {ImageDTO} req
   * @param {Response} res
   * @returns {JSON}
   */
  @Get("reports/*filePath")
  @ApiOperation({
    summary: "Video upload",
    description: "Video upload",
  })
  @ApiResponse({
    status: 200,
    description: "Video uploaded successfully",
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
  async findVideos(@Req() req: ImageDTO, @Res() res) {
    try {
      const path = __dirname + "/../../../" + req.path.substr(1);
      if (fs.existsSync(path)) {
        res.sendFile(req.path.substr(1), { root: __dirname + "/../../../" });
      }
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        null,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );
      return res.status(response.statusCode).json(response);
    }
  }
}
