import { forwardRef, Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { User } from "src/entities";
import { VerificationCodeTypeEnum } from "src/modules/shared/auth/userVerificationCode/interface/userVerificationCode.interface";
import { UserVerificationCodeService } from "src/modules/shared/auth/userVerificationCode/userVerificationCode.service";
import { UserDTO } from "./dto";

@Injectable()
export class UserService extends BaseService {
  constructor(
    @Inject(forwardRef(() => UserVerificationCodeService))
    private _userVerificationCodeService: UserVerificationCodeService,
    private _globalResponses: GlobalResponses,
  ) {
    super(User);
  }

  /**
   * Find by email
   * @description Find user by email.
   * @param {Request} req
   * @param {String} email
   * @returns {Promise<object>}
   */
  async findByEmail(email: string): Promise<object> {
    return this.findOne({ email: email.toLowerCase() });
  }

  /**
   * Generate username
   * @description generate unique username.
   * @param {String} name
   * @returns {Promise<string>}
   */
  async generateUsername(name: string): Promise<string> {
    const uid = name + Number(new Date());
    const idExist = await this.findOne({ username: uid });
    if (!idExist) {
      return uid;
    } else {
      return this.generateUsername(uid);
    }
  }

  /**
   * Create user
   * @description Create new user record.
   * @param {UserDTO} payload
   * @return {Promise<ApiResponse>}
   */
  async createUser(req: Request, payload: UserDTO): Promise<ApiResponse> {
    let response = this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.ERROR,
      null,
      null,
    );

    const userExists = await this.findByEmail(payload.email);
    const phoneNumberExists = await this.findOne({
      phoneNumber: payload.phoneNumber,
    });

    // Check if user exists against this email then notify user.
    if (userExists) {
      response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "email_already_exists",
      );
    } else if (phoneNumberExists) {
      response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "phone_number_already_exists",
      );
    } else {
      let hashPass = null;

      if (payload.password) {
        hashPass = await bcrypt.hash(payload.password, 10);
      }
      const newUser = await this.create({
        ...payload,
        password: hashPass,
        role: GlobalEnums.USER_ROLES.USER,
        status: GlobalEnums.ACTIVE_STATUSES.ACTIVE,
        username: payload.phoneNumber,
        registrationStatus:
          GlobalEnums.REGISTRATION_STATUSES.REGISTRATION_STARTED,
      });

      if (newUser) {
        await this._userVerificationCodeService.sendVerificationEmail(
          req,
          payload.email.toLowerCase(),
          VerificationCodeTypeEnum.REGISTRATION,
        );

        const result = { ...newUser["dataValues"] };

        delete result.password; // Remove the 'password' property

        response = this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          result,
          "user_created",
        );
      }
    }

    return response;
  }
}
