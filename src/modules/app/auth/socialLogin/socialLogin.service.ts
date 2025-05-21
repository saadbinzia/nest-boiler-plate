import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Request } from "express";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { SocialLogin } from "src/entities";
import { SharedAuthService } from "src/modules/shared/auth/auth.service";
import { UserService } from "../../user/user.service";
import { SocialSignUpDTO } from "../dto/socialLogin.dto";
// import { OAuth2Client } from "google-auth-library";

@Injectable()
export class SocialLoginService extends BaseService {
  constructor(
    private readonly _globalResponses: GlobalResponses,
    @Inject(forwardRef(() => UserService))
    private readonly _userService: UserService,
    @Inject(forwardRef(() => SharedAuthService))
    private readonly _sharedAuthService: SharedAuthService,
  ) {
    super(SocialLogin);
  }

  async socialSignUp(
    req: Request,
    payload: SocialSignUpDTO,
  ): Promise<ApiResponse> {
    const isRequestValid = await this.validateRequest(payload);
    if (isRequestValid) {
      const user = await this._userService.findOne(
        {
          email: payload.email.toLowerCase(),
        },
        null,
        [
          "firstName",
          "lastName",
          "password",
          "id",
          "email",
          "preferredLanguage",
          "registrationStatus",
          "role",
        ],
      );

      if (user) {
        const socialLoginExists = await this.findOne({
          userId: user.id,
          type: payload.type,
        });
        if (!socialLoginExists) {
          await this.create({ ...payload, userId: user.id });
        }

        const token = await this._sharedAuthService.createToken(
          req,
          user.id,
          user.email,
          user.role,
          false,
          user.preferredLanguage,
        );

        return this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          { token: token, registrationStatus: user.registrationStatus },
          "user_login",
        );
      } else {
        if (payload.phoneNumber) {
          const userResponse = await this._userService.createUser(req, {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email.toLowerCase(),
            phoneNumber: payload.phoneNumber,
            referralUser: payload.referralUser,
            preferredLanguage: payload.preferredLanguage,
            keepUserUpdated: true,
            agreeTermsAndConditions: true,
          });

          const newUser = userResponse.data;
          await this.create({ ...payload, userId: newUser.id });

          const token = await this._sharedAuthService.createToken(
            req,
            newUser.id,
            newUser.email,
            newUser.role,
            false,
            newUser.preferredLanguage,
          );

          return this._globalResponses.formatResponse(
            req,
            GlobalEnums.RESPONSE_STATUSES.SUCCESS,
            { token: token, registrationStatus: newUser.registrationStatus },
            "user_login",
          );
        } else {
          return this._globalResponses.formatResponse(
            req,
            GlobalEnums.RESPONSE_STATUSES.ERROR,
            null,
            "phone_number_is_missing",
          );
        }
      }
    } else {
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "invalid_user_credentials",
      );
    }
  }

  async userSocialSignIn(
    req: Request,
    payload: SocialSignUpDTO,
  ): Promise<ApiResponse> {
    const isRequestValid = await this.validateRequest(payload);
    if (isRequestValid) {
      const user = await this._userService.findOne(
        {
          email: payload.email.toLowerCase(),
        },
        null,
        [
          "firstName",
          "lastName",
          "password",
          "id",
          "email",
          "registrationStatus",
          "preferredLanguage",
          "role",
        ],
      );

      if (user) {
        const socialLoginExists = await this.findOne({
          userId: user.id,
          type: payload.type,
        });
        if (!socialLoginExists) {
          await this.create({ ...payload, userId: user.id });
        }

        const token = await this._sharedAuthService.createToken(
          req,
          user.id,
          user.email,
          user.role,
          false,
          user.preferredLanguage,
        );

        return this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          { token: token, registrationStatus: user.registrationStatus },
          "user_login",
        );
      } else {
        return this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          "user_not_linked_with_app",
        );
      }
    } else {
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "invalid_user_details",
      );
    }
  }

  async validateRequest(payload: SocialSignUpDTO): Promise<boolean> {
    console.log(payload);

    return true;
    // if (payload.type === "google") {
    //   const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    //   const client = new OAuth2Client(CLIENT_ID);

    //   try {
    //     const token = payload.socialLoginData?.account?.id_token;

    //     if (!token) {
    //       console.error("Access token is missing");
    //       return false;
    //     }

    //     await client.verifyIdToken({
    //       idToken: token,
    //       audience: CLIENT_ID,
    //     });

    //     return true;
    //   } catch (error) {
    //     console.error("Error verifying Google token:", error);
    //     return false;
    //   }
    // } else {
    //   return false;
    // }
  }
}
