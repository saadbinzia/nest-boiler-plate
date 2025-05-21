import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import {
  ErrorResponse,
  SuccessResponse,
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";
import { UserDTO } from "./dto";
import { UserService } from "./user.service";

@ApiTags("Clients / Simple User")
@Controller("users")
export class UsersController {
  constructor(
    private readonly _userService: UserService,
    private readonly _globalResponses: GlobalResponses,
  ) {}

  /**
   * Create user
   * @description Create new user record.
   * @param {Response} res
   * @param {UserDTO} body
   * @returns {Promise<JSON>}
   */
  @Post("create-user")
  @ApiOperation({
    summary: "User Sign Up",
    description: "User can sign up from app end.",
  })
  @ApiResponse({
    status: 200,
    description: "Create Users Account",
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
    type: UserDTO,
    examples: {
      a: {
        summary: "Sample that return success response",
        value: {
          email: "someuniqueemail",
          firstName: "Saad",
          lastName: "Bin Zia",
          phoneNumber: "+923034197551",
          password: "P@ss2word",
          keepUserUpdated: true,
          agreeTermsAndConditions: true,
        },
      },
      b: {
        summary: "Sample that return validation error",
        value: {
          email: "saadbinzia055",
          firstName: "Saad",
          lastName: "Bin Zia",
          phoneNumber: "+923034197551",
          password: "pass2word",
          keepUserUpdated: true,
          agreeTermsAndConditions: true,
        },
      },
      c: {
        summary: "Sample with referral user and preferred language",
        value: {
          email: "saadbinzia055@gmail.com",
          firstName: "Saad",
          lastName: "Bin Zia",
          phoneNumber: "+923034197551",
          password: "P@ss2word",
          keepUserUpdated: true,
          agreeTermsAndConditions: true,
          referralUser: "username",
          preferredLanguage: "en",
        },
      },
    },
  })
  async createUser(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: UserDTO,
  ): Promise<object> {
    try {
      const response = await this._userService.createUser(req, body);
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
