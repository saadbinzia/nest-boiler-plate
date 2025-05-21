import { Inject, Injectable, forwardRef } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import { Op } from "sequelize";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { User } from "src/entities";
import { UserSessionService } from "../../auth/userSession/userSession.service";
import {
  VerificationCodeStatusEnum,
  VerificationCodeTypeEnum,
} from "../../auth/userVerificationCode/interface/userVerificationCode.interface";
import { UserVerificationCodeService } from "../../auth/userVerificationCode/userVerificationCode.service";
import { ResetPasswordDTO, VerifyResetPasswordCodeDTO } from "../dto";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { UserService } from "../user.service";
import { SystemSettingService } from "src/core/config/systemSetting.service";

@Injectable()
export class ForgetPasswordService extends BaseService {
  constructor(
    @Inject(forwardRef(() => UserSessionService))
    private _userSessionService: UserSessionService,
    @Inject(forwardRef(() => UserVerificationCodeService))
    private _userVerificationCodeService: UserVerificationCodeService,
    @Inject(forwardRef(() => UserService))
    private _userService: UserService,
    @Inject(forwardRef(() => SystemSettingService))
    private _systemSettingService: SystemSettingService,

    private _globalResponses: GlobalResponses,
  ) {
    super(User);
  }

  /**
   * Verify code
   * @description verify code if reset code exists in our record.
   * @param {Request} req
   * @param {VerifyResetPasswordCodeDTO} body
   * @returns {Promise<ApiResponse>}
   */
  async verifyCode(
    req: Request,
    body: VerifyResetPasswordCodeDTO,
    type: VerificationCodeTypeEnum,
  ): Promise<ApiResponse> {
    const code = await this._userVerificationCodeService.findOne(
      { code: body.code, type: type },
      [
        {
          model: User,
          where: {
            email: body.email,
          },
        },
      ],
    );

    if (code) {
      const verificationCodeExpiry =
        await this._systemSettingService.getNumberValueByKey(
          GlobalEnums.SYSTEM_SETTING_KEYS.VERIFICATION_CODE_EXPIRY,
        );

      const beforeExpiry = new Date(
        new Date().getTime() - verificationCodeExpiry * 60 * 1000,
      );
      if (
        code.codeStatus !== VerificationCodeStatusEnum.SENT ||
        code.createdAt <= beforeExpiry
      ) {
        await this._userVerificationCodeService.updateById(code.id, {
          codeStatus: VerificationCodeStatusEnum.EXPIRED,
        });
        return this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          "forgot_code_expired",
        );
      }

      await this._userVerificationCodeService.updateOne(
        { code: body.code, codeStatus: VerificationCodeStatusEnum.SENT },
        { codeStatus: VerificationCodeStatusEnum.VALIDATED },
      );

      if (
        code.user.registrationStatus ==
        GlobalEnums.REGISTRATION_STATUSES.REGISTRATION_STARTED
      ) {
        await this._userService.updateById(code.userId, {
          registrationStatus:
            GlobalEnums.REGISTRATION_STATUSES.REGISTRATION_COMPLETED,
        });
      }

      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.SUCCESS,
        {},
        "forgot_code_verified",
      );
    } else {
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "invalid_forgot_code",
      );
    }
  }

  /**
   * Verify UUID
   * @description This function will be used to verify user through uuid to allow him reset his password
   * @param {Request} req
   * @param {string} uuid
   */
  async verifyUUId(
    req: Request,
    uuid: string,
    type: VerificationCodeTypeEnum,
  ): Promise<ApiResponse> {
    const code = await this._userVerificationCodeService.findOne(
      {
        uuid: uuid,
        type: type,
      },
      [
        {
          model: User,
        },
      ],
    );

    if (code) {
      const isExpired = await this.checkCodeExpiration(code.createdAt);
      if (code.codeStatus !== VerificationCodeStatusEnum.SENT || isExpired) {
        await this._userVerificationCodeService.updateById(code.id, {
          codeStatus: VerificationCodeStatusEnum.EXPIRED,
        });
        return this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          "forgot_code_expired",
        );
      }

      await this._userVerificationCodeService.updateOne(
        { uuid: uuid, codeStatus: VerificationCodeStatusEnum.SENT },
        { codeStatus: VerificationCodeStatusEnum.VALIDATED },
      );

      if (
        code.user.registrationStatus ==
        GlobalEnums.REGISTRATION_STATUSES.REGISTRATION_STARTED
      ) {
        await this._userService.updateById(code.userId, {
          registrationStatus:
            GlobalEnums.REGISTRATION_STATUSES.REGISTRATION_COMPLETED,
        });
      }

      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.SUCCESS,
        {},
        "forgot_code_verified",
      );
    } else {
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "invalid_forgot_code",
      );
    }
  }

  /**
   * Reset Password
   * @description To allow user to reset password
   * @param {Request} req
   * @param {ResetPasswordDTO} body
   * @returns {Promise<ApiResponse>}
   */
  async resetPassword(
    req: Request,
    body: ResetPasswordDTO,
  ): Promise<ApiResponse> {
    const code = await this._userVerificationCodeService.findOne({
      [Op.or]: [
        {
          code: body.code,
        },
        {
          uuid: body.uuid,
        },
      ],
      codeStatus: VerificationCodeStatusEnum.VALIDATED,
      type: VerificationCodeTypeEnum.FORGET_PASSWORD,
    });

    if (code) {
      const verificationCodeExpiry =
        await this._systemSettingService.getNumberValueByKey(
          GlobalEnums.SYSTEM_SETTING_KEYS.VERIFICATION_CODE_EXPIRY,
        );

      const beforeExpiry = new Date(
        new Date().getTime() - verificationCodeExpiry * 60 * 1000,
      );
      if (code.createdAt <= beforeExpiry) {
        await this._userVerificationCodeService.updateById(code.id, {
          codeStatus: VerificationCodeStatusEnum.EXPIRED,
        });
        return this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          "forgot_code_expired",
        );
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);
      await this.updateOne({ id: code.userId }, { password: hashedPassword });
      await this._userVerificationCodeService.updateOne(
        { code: body.code, codeStatus: VerificationCodeStatusEnum.VALIDATED },
        { codeStatus: VerificationCodeStatusEnum.EXPIRED },
      );
      await this._userSessionService.logoutAllSessions(req, code.userId);
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.SUCCESS,
        null,
        "password_resetted",
      );
    } else {
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "invalid_forgot_code",
      );
    }
  }

  /**
   * Check Code Expiration
   * @description This function can be used to check expiration of forget password code.
   * @param {date} createdAt
   * @returns {boolean}
   */
  async checkCodeExpiration(createdAt: Date): Promise<boolean> {
    const verificationCodeExpiry =
      await this._systemSettingService.getNumberValueByKey(
        GlobalEnums.SYSTEM_SETTING_KEYS.VERIFICATION_CODE_EXPIRY,
      );

    const beforeExpiry = new Date(
      new Date().getTime() - verificationCodeExpiry * 60 * 1000,
    );
    return createdAt <= beforeExpiry;
  }
}
