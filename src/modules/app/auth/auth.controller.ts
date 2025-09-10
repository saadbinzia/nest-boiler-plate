import { Body, Controller, Logger, Post, Req, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import {
  ErrorResponse,
  SuccessResponse,
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

const { RESPONSE_STATUSES } = GlobalEnums;
const CONTEXT = "AuthController";
@ApiTags("Authentication for clients / simple user")
@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(CONTEXT);

  constructor(
    private readonly _authService: AuthService,
    private readonly _globalResponses: GlobalResponses,
  ) {}

  /**
   * Login
   * @description User can login from app end.
   * @param {AuthDto} body
   * @param {Request} req
   * @returns {Promise<JSON>}
   */
  @Post("login")
  @ApiOperation({
    summary: "User login",
    description: "User can login from app end using his email and password.",
  })
  @ApiResponse({
    status: 200,
    description: "User logged in successfully",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid credentials",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid credentials",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 422,
    description: "Unprocessable Entity - Validation error",
    type: UnprocessableResponse,
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
    type: ErrorResponse,
  })
  @ApiBody({
    description: "User can login from app end using his email and password.",
    type: AuthDto,
    examples: {
      a: {
        summary: "Sample that return No Error",
        value: {
          email: "sadiaali1286@gmail.com",
          password: "P@ss2word",
          rememberMe: true,
        },
      },
      b: {
        summary: "Sample that return Unprocessable Entity",
        value: {
          email: "somerandomemail.com",
          password: "pass2word",
          rememberMe: true,
        },
      },
    },
  })
  async login(
    @Body() body: AuthDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const response = await this._authService.login(body, req);

      res.status(response.statusCode).json(response);
    } catch (error) {
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
