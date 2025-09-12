import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import {
  ErrorResponse,
  SuccessResponse,
  unAuthorizedResponse,
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import {
  ChangeUserPasswordDTO,
  ResendCodeDTO,
  UpdateUserDTO,
  SharedVerifyResetPasswordCodeDTO,
} from "./dto";
import { ForgetPasswordService } from "./forgetPassword/forgetPassword.service";
import { UserService } from "./user.service";

const { VERIFICATION_CODE_TYPE, RESPONSE_STATUSES } = GlobalEnums;
@ApiTags("APIs for all user")
@Controller("shared/users")
export class UsersController {
  constructor(
    private readonly _userService: UserService,
    private readonly _forgetPasswordService: ForgetPasswordService,
    private readonly _globalResponses: GlobalResponses,
  ) {}

  /**
   * Find
   * @description Find user by id.
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @returns {Promise<JSON>}
   */
  @UseGuards(JwtAuthGuard)
  @Get("find")
  @ApiOperation({
    summary: "Find user",
    description: "Find user by id if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiBearerAuth("access-token")
  async find(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    try {
      const response = await this._userService.find(req);
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  /**
   * Update user
   * @description Update user record on given condition.
   * @param {Response} res
   * @param {UpdateUserDTO} payload
   * @param {Object} param
   * @returns {Promise<JSON>}
   */
  @UseGuards(JwtAuthGuard)
  @Put("update")
  @ApiOperation({
    summary: "Update user",
    description: "Update user if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
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
    description: 'Fields allowed to update for the current authenticated user',
    type: UpdateUserDTO,
    examples: {
      valid: {
        summary: 'Valid update payload',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+923001234567',
        },
      },
      invalidName: {
        summary: 'Invalid name (contains numbers)',
        value: {
          firstName: 'J0hn',
          lastName: 'Doe1',
        },
      },
      invalidPhone: {
        summary: 'Invalid phone format',
        value: {
          phoneNumber: '12345',
        },
      },
    },
  })
  @ApiBearerAuth("access-token")
  async updateUser(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Body() payload: UpdateUserDTO,
  ): Promise<void> {
    try {
      const response = await this._userService.updateUser(
        req,
        req.user.id,
        payload,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  /**
   * Change password
   * @description Change users password.
   * @param {Response} res
   * @param {ChangeUserPasswordDTO} payload
   * @param {Object} param
   * @returns {Promise<JSON>}
   */
  @UseGuards(JwtAuthGuard)
  @Put("change-password")
  @ApiOperation({
    summary: "Change user password",
    description: "change user password if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "User's password changed successfully",
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
    description: "User can login from app end using his email and password.",
    type: ChangeUserPasswordDTO,
    examples: {
      a: {
        summary: "Sample that return No Error",
        value: {
          oldPassword: "P@ss2word",
          newPassword: "P@ss1word",
        },
      },
    },
  })
  @ApiBearerAuth("access-token")
  async changePassword(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Body() payload: ChangeUserPasswordDTO,
  ): Promise<void> {
    try {
      const response = await this._userService.changePassword(
        req,
        req.user.id,
        payload,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  /**
   * Resend the verification code to the user's email
   *
   * @param {Request} req - request
   * @param {Res} res - response
   * @param {ResendCodeDTO} body - the user's email
   * @return {Promise<void>} a promise representing the result of resending the code
   */
  @ApiOperation({
    summary: "Request rigistration code",
    description: "Request for rigistration code.",
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
    description: "Request rigistration code",
    type: ResendCodeDTO,
    examples: {
      a: {
        summary: "Sample request rigistration code",
        value: {
          email: "saadbinzia055@gmail.com",
        },
      },
    },
  })
  @Post("resend-registration-code")
  async resendRegistrationCode(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ResendCodeDTO,
  ): Promise<void> {
    try {
      const response = await this._userService.resendRegistrationCode(
        req,
        body,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  /**
   * Verify user rigistration code.
   * @description verify code for rigistration.
   * @param {Response} res
   * @param {VerifyResetPasswordCodeDTO} body
   * @returns {Promise<JSON>}
   */
  @Post("verify-registration-code")
  @ApiOperation({
    summary: "Verify rigistration code",
    description: "Verify code for rigistration.",
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
    description: "Verify rigistration code",
    type: SharedVerifyResetPasswordCodeDTO,
    examples: {
      a: {
        summary: "Sample for rigistration",
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
    @Body() body: SharedVerifyResetPasswordCodeDTO,
  ): Promise<void> {
    try {
      const response = await this._forgetPasswordService.verifyCode(
        req,
        body,
        VERIFICATION_CODE_TYPE.REGISTRATION,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  /**
   * Verify user rigistration code.
   * @description verify code for rigistration.
   * @param {Response} res
   * @param {VerifyResetPasswordCodeDTO} body
   * @returns {Promise<JSON>}
   */
  @Get("verify-registration-uuid/:uuid")
  @ApiOperation({
    summary: "Verify rigistration uuid",
    description: "Verify uuid for rigistration.",
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
  ): Promise<void> {
    try {
      const response = await this._forgetPasswordService.verifyUUId(
        req,
        uuid,
        VERIFICATION_CODE_TYPE.REGISTRATION,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Put("upload-profile-image")
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Change profile image",
    description: "change profile image if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "User's profile image changed successfully",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadImage(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    try {
      res.json(await this._userService.uploadImage(req, file));
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete-profile-image")
  @ApiOperation({
    summary: "Delete profile image",
    description: "Delete profile image if token is valid.",
  })
  @ApiBearerAuth("access-token")
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "User's profile image deleted successfully",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  async deleteImage(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      res.json(await this._userService.deleteImage(req));
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }
}
