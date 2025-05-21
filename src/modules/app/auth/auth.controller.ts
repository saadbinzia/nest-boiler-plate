import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { SocialSignUpDTO } from "./dto/socialLogin.dto";
import { SocialLoginService } from "./socialLogin/socialLogin.service";
import { UserDTO } from "../user/dto";
import { UserService } from "../user/user.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  ErrorResponse,
  SuccessResponse,
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";

@ApiTags("Authentication for clients / simple user")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _globalResponses: GlobalResponses,
    private readonly _socialLogin: SocialLoginService,
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
    description: "Vaidate the email and password",
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
    @Res() res,
  ): Promise<object> {
    const response = await this._authService.login(body, req);
    return res.status(response.statusCode).json(response);
  }

  /**
   * Create user
   * @description Create new user record.
   * @param {Response} res
   * @param {UserDTO} body
   * @returns {Promise<JSON>}
   */
  @Post("sign-up")
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
  async signUp(
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

  /**
   * Social Login Sign Up
   * @description Logout from all active sessions.
   * @param {Response} res
   * @param {Request} req
   * @param {SocialSignUpDTO} payload
   * @returns {Promise<JSON>}
   */
  @Post("social-sign-up")
  @ApiOperation({
    summary: "Social Sign Up",
    description: "Sign Up through google, facebook etc",
  })
  @ApiResponse({
    status: 200,
    description: "Social sign up",
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
    description: "Social sign up",
    type: SocialSignUpDTO,
    examples: {
      a: {
        summary: "Sample that return No Error",
        value: {
          email: "somerandomemail.com",
          firstName: "Saad",
          lastName: "Bin Zia",
          type: "google",
          phoneNumber: "phone number",
          referralUser: "username",
          preferredLanguage: "es",
          socialLoginData: {
            allPayload: "add all payload we get from the provider",
          },
        },
      },
      b: {
        summary: "Sample that return validation error",
        value: {
          email: "saadbinzia054@",
          firstName: "Saad",
          lastName: "Bin Zia",
          type: "google",
          socialLoginData: {
            allPayload: "add all payload we get from the provider",
          },
        },
      },
    },
  })
  async socialSignUp(
    @Res() res: Response,
    @Req() req: Request,
    @Body() payload: SocialSignUpDTO,
  ): Promise<object> {
    try {
      const response = await this._socialLogin.socialSignUp(req, payload);
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
   * Social Login Sign In
   * @description Logout from all active sessions.
   * @param {Response} res
   * @param {Request} req
   * @param {SocialSignInDTO} payload
   * @returns {Promise<JSON>}
   */
  @Post("social-sign-in")
  @ApiOperation({
    summary: "Social Login",
    description: "Login through google, facebook etc",
  })
  @ApiResponse({
    status: 200,
    description: "Social login",
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
    description: "Social Login",
    type: SocialSignUpDTO,
    examples: {
      a: {
        summary: "Sample that return No Error",
        value: {
          email: "somerandomemail.com",
          firstName: "Saad",
          lastName: "Bin Zia",
          type: "google",
          socialLoginData: {
            allPayload: "add all payload we get from the provider",
          },
        },
      },
      b: {
        summary: "Sample that return validation error",
        value: {
          email: "saadbinzia054@",
          firstName: "Saad",
          lastName: "Bin Zia",
          type: "google",
          socialLoginData: {
            allPayload: "add all payload we get from the provider",
          },
        },
      },
    },
  })
  async socialSignIn(
    @Res() res: Response,
    @Req() req: Request,
    @Body() payload: SocialSignUpDTO,
  ): Promise<object> {
    try {
      const response = await this._socialLogin.userSocialSignIn(req, payload);
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
