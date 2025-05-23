import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import {
  ForgetPasswordDTO,
  ResetPasswordDTO,
  VerifyResetPasswordCodeDTO,
} from "../dto";
import { ForgetPasswordService } from "./forgetPassword.service";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  ErrorResponse,
  SuccessResponse,
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";
import { VerificationCodeTypeEnum } from "../../auth/userVerificationCode/interface/userVerificationCode.interface";
import { UserVerificationCodeService } from "../../auth/userVerificationCode/userVerificationCode.service";

@ApiTags("Password Recovery for users")
@Controller("forget-password")
export class ForgetPasswordsController {
  constructor(
    private readonly _forgetPasswordService: ForgetPasswordService,
    private readonly _userVerificationCodeService: UserVerificationCodeService,
    private readonly _globalResponses: GlobalResponses,
  ) {}

  /**
   * Send Reset Email.
   * @description Send forget password email to user.
   * @param {Response} res
   * @param {ForgetPasswordDTO} body
   * @returns {Promise<JSON>}
   */
  @Post("send-reset-email")
  @ApiOperation({
    summary: "Request reset password",
    description: "Request for reset password.",
  })
  @ApiResponse({
    status: 200,
    description: "Email will be sent if the email enetered is in our database",
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
  @ApiBody({
    description: "Request reset password",
    type: ForgetPasswordDTO,
    examples: {
      a: {
        summary: "Sample request reset password",
        value: {
          email: "saadbinzia055@gmail.com",
        },
      },
    },
  })
  async sendResetEmail(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: ForgetPasswordDTO,
  ): Promise<object> {
    try {
      const response =
        await this._userVerificationCodeService.sendVerificationEmail(
          req,
          body.email.toLowerCase(),
          VerificationCodeTypeEnum.FORGET_PASSWORD,
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

  /**
   * Verify user reset password code.
   * @description verify code for reset password.
   * @param {Response} res
   * @param {VerifyResetPasswordCodeDTO} body
   * @returns {Promise<JSON>}
   */
  @Post("verify-code")
  @ApiOperation({
    summary: "Verify reset password code",
    description: "Verify code for reset password.",
  })
  @ApiResponse({
    status: 200,
    description: "Verify the code sent on the user email",
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
  @ApiBody({
    description: "Verify reset password code",
    type: VerifyResetPasswordCodeDTO,
    examples: {
      a: {
        summary: "Sample for reset password",
        value: {
          email: "devtester@site.com",
          code: "6481",
        },
      },
    },
  })
  async verifyCode(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: VerifyResetPasswordCodeDTO,
  ): Promise<object> {
    try {
      const response = await this._forgetPasswordService.verifyCode(
        req,
        body,
        VerificationCodeTypeEnum.FORGET_PASSWORD,
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

  /**
   * Verify user reset password code.
   * @description verify code for reset password.
   * @param {Response} res
   * @param {VerifyResetPasswordCodeDTO} body
   * @returns {Promise<JSON>}
   */
  @Get("verify-uuid/:uuid")
  @ApiOperation({
    summary: "Verify reset password uuid",
    description: "Verify uuid for reset password.",
  })
  @ApiResponse({
    status: 200,
    description: "Verify the uuid sent on the user email",
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
  @ApiParam({
    name: "uuid",
    type: String,
    description: "The session id",
    required: true,
  })
  async verifyUUId(
    @Res() res: Response,
    @Req() req: Request,
    @Param("uuid") uuid: string,
  ): Promise<object> {
    try {
      const response = await this._forgetPasswordService.verifyUUId(
        req,
        uuid,
        VerificationCodeTypeEnum.FORGET_PASSWORD,
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

  /**
   * Reset password.
   * @description This route will allow user to reset password after validation of reset code.
   * @param {Response} res
   * @param {ResetPasswordDTO} body
   * @returns {Promise<JSON>}
   */
  @Put("reset-password")
  @ApiOperation({ summary: "Reset password", description: "Reset password." })
  @ApiResponse({
    status: 200,
    description: "Reset the code",
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
  @ApiBody({
    description: "Reset password",
    type: ResetPasswordDTO,
    examples: {
      a: {
        summary: "Sample for verify reset password code",
        value: {
          code: "",
          password: "P@ss1word",
          uuid: "2dce3600-e2bd-11ef-8916-11810600a3ea",
        },
      },
    },
  })
  async resetPassword(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: ResetPasswordDTO,
  ): Promise<object> {
    try {
      const response = await this._forgetPasswordService.resetPassword(
        req,
        body,
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
