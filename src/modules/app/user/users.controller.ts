import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  Res,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import {
  ErrorResponse,
  SuccessResponse,
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

const { RESPONSE_STATUSES } = GlobalEnums;

@ApiTags("Clients / Simple User")
@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly _globalResponses: GlobalResponses,
  ) {}

  /**
   * Sign Up
   * @description Create new user account for client registration.
   * @param {Response} res
   * @param {Request} req
   * @param {CreateUserDto} body
   * @returns {Promise<JSON>}
   */
  @Post("signup")
  @ApiOperation({
    summary: "User Sign Up",
    description:
      "User can sign up from app end. After signup, user can login and access all other APIs.",
  })
  @ApiResponse({
    status: 200,
    description: "User account created successfully",
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
  @ApiResponse({
    status: 409,
    description: "Conflict - Email already exists",
    type: ErrorResponse,
  })
  @ApiBody({
    description: "Create User Account",
    type: CreateUserDto,
    examples: {
      a: {
        summary: "Sample that return success response",
        value: {
          email: "user@example.com",
          fullName: "John Doe",
          password: "P@ss2word",
        },
      },
      b: {
        summary: "Sample that return validation error",
        value: {
          email: "invalidemail",
          fullName: "John Doe",
          password: "pass",
        },
      },
    },
  })
  async signup(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: CreateUserDto,
  ): Promise<void> {
    try {
      const response = await this.userService.createUser(req, body);
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
