import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AdminAuthDto } from "./dto/auth.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  ErrorResponse,
  SuccessResponse,
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";

@ApiTags("Authentication for admin only")
@Controller("/admin/auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  /**
   * Login
   * @description User can login from app end.
   * @param {AuthDto} body
   * @param {Request} req
   * @returns {Promise<JSON>}
   */
  @Post("login")
  @ApiOperation({
    summary: "Admin Login",
    description: "Login to Admin Account.",
  })
  @ApiResponse({
    status: 200,
    description: "Admin Login Successfully",
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
    description: "Create User Account",
    type: AdminAuthDto,
    examples: {
      a: {
        summary: "Sample that return No Error",
        value: {
          email: "admin@site.com",
          password: "pass2word",
          rememberMe: true,
        },
      },
    },
  })
  async login(
    @Body() body: AdminAuthDto,
    @Req() req: Request,
    @Res() res,
  ): Promise<void> {
    const response = await this._authService.login(body, req);
    res.status(response.statusCode).json(response);
  }
}
