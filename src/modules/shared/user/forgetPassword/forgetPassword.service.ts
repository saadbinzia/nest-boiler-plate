import { Inject, Injectable, forwardRef } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import { Op } from "sequelize";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums, TVerificationCode } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { SystemSettingService } from "src/core/config/systemSetting.service";
import { User } from "src/entities";
import { UserSessionService } from "../../auth/userSession/userSession.service";
import { UserVerificationCodeService } from "../../auth/userVerificationCode/userVerificationCode.service";
import { SharedResetPasswordDTO, SharedVerifyResetPasswordCodeDTO } from "../dto";
import { UserService } from "../user.service";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";

// Destructure enums for easier access
const {
  VERIFICATION_CODE_STATUS,
  RESPONSE_STATUSES,
  REGISTRATION_STATUSES,
  SYSTEM_SETTING_KEYS,
  VERIFICATION_CODE_TYPE,
} = GlobalEnums;

@Injectable()
export class ForgetPasswordService extends BaseService<User> {
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
    body: SharedVerifyResetPasswordCodeDTO,
    type: TVerificationCode,
  ): Promise<ApiResponse> {
    const code = await this._userVerificationCodeService.findOne(
      req,
      { code: body.code, type: type },
      {
        include: [
          {
            model: User,
            where: {
              email: body.email,
            },
          },
        ],
      },
    );

    if (code) {
      const verificationCodeExpiry =
        await this._systemSettingService.getNumberValueByKey(
          req,
          SYSTEM_SETTING_KEYS.VERIFICATION_CODE_EXPIRY,
        );

      const beforeExpiry = new Date(
        new Date().getTime() - verificationCodeExpiry * 60 * 1000,
      );
      if (
        code.status !== VERIFICATION_CODE_STATUS.PENDING ||
        code.createdAt <= beforeExpiry
      ) {
        await this._userVerificationCodeService.update(
          req,
          { id: code.id },
          {
            status: VERIFICATION_CODE_STATUS.EXPIRED,
          },
        );
        const error = new Error("forgot_code_expired");
        error.name = "BadRequestError";
        throw error;
      }

      await this._userVerificationCodeService.update(
        req,
        { code: body.code, status: VERIFICATION_CODE_STATUS.PENDING },
        { status: VERIFICATION_CODE_STATUS.VERIFIED },
      );

      if (code.user.registrationStatus == REGISTRATION_STATUSES.PENDING) {
        await this._userService.updateById(req, code.userId, {
          registrationStatus: REGISTRATION_STATUSES.COMPLETED,
        });
      }

      return this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.SUCCESS,
        {},
        "forgot_code_verified",
      );
    } else {
      const error = new Error("invalid_forgot_code");
      error.name = "BadRequestError";
      throw error;
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
    type: TVerificationCode,
  ): Promise<ApiResponse> {
    const code = await this._userVerificationCodeService.findOne(
      req,
      {
        uuid: uuid,
        type: type,
      },
      {
        include: [
          {
            model: User,
          },
        ],
      },
    );

    if (code) {
      const isExpired = await this.checkCodeExpiration(req, code.createdAt);
      if (code.status === VERIFICATION_CODE_STATUS.VERIFIED) {
        const error = new Error("code_already_verified");
        error.name = "BadRequestError";
        throw error;
      }

      if (code.status === VERIFICATION_CODE_STATUS.EXPIRED || isExpired) {
        await this._userVerificationCodeService.updateById(req, code.id, {
          status: VERIFICATION_CODE_STATUS.EXPIRED,
        });

        const error = new Error("forgot_code_expired");
        error.name = "BadRequestError";
        throw error;
      }

      await this._userVerificationCodeService.update(
        req,
        { uuid: uuid, status: VERIFICATION_CODE_STATUS.PENDING },
        { status: VERIFICATION_CODE_STATUS.VERIFIED },
      );

      if (code.user.registrationStatus == REGISTRATION_STATUSES.PENDING) {
        await this._userService.updateById(req, code.userId, {
          registrationStatus: REGISTRATION_STATUSES.COMPLETED,
        });
      }

      return this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.SUCCESS,
        {},
        "forgot_code_verified",
      );
    } else {
      const error = new Error("invalid_forgot_code");
      error.name = "BadRequestError";
      throw error;
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
    body: SharedResetPasswordDTO,
  ): Promise<ApiResponse> {
    const conditions = [];

    if (body.code) {
      conditions.push({ code: body.code });
    }

    if (body.uuid) {
      conditions.push({ uuid: body.uuid });
    }

    if (conditions.length === 0) {
      const error = new Error("code_not_provided");
      error.name = "BadRequestError";
      throw error;
    }

    const code = await this._userVerificationCodeService.findOne(req, {
      [Op.or]: conditions,
      status: VERIFICATION_CODE_STATUS.VERIFIED,
      type: VERIFICATION_CODE_TYPE.PASSWORD_RESET,
    });

    if (code) {
      const verificationCodeExpiry =
        await this._systemSettingService.getNumberValueByKey(
          req,
          SYSTEM_SETTING_KEYS.VERIFICATION_CODE_EXPIRY,
        );

      const beforeExpiry = new Date(
        new Date().getTime() - verificationCodeExpiry * 60 * 1000,
      );

      if (code.createdAt <= beforeExpiry) {
        await this._userVerificationCodeService.updateById(req, code.id, {
          status: VERIFICATION_CODE_STATUS.EXPIRED,
        });
        const error = new Error("forgot_code_expired");
        error.name = "BadRequestError";
        throw error;
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);
      await this.update(req, { id: code.userId }, { password: hashedPassword });
      await this._userVerificationCodeService.update(
        req,
        { [Op.or]: conditions, status: VERIFICATION_CODE_STATUS.VERIFIED },
        { status: VERIFICATION_CODE_STATUS.EXPIRED },
      );
      await this._userSessionService.logoutAllSessions(req, code.userId);
      return this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.SUCCESS,
        null,
        "password_resetted",
      );
    } else {
      const error = new Error("invalid_forgot_code");
      error.name = "BadRequestError";
      throw error;
    }
  }

  /**
   * Check Code Expiration
   * @description This function can be used to check expiration of forget password code.
   * @param {date} createdAt
   * @returns {boolean}
   */
  async checkCodeExpiration(
    req: Request | AuthenticatedRequest,
    createdAt: Date,
  ): Promise<boolean> {
    const verificationCodeExpiry =
      await this._systemSettingService.getNumberValueByKey(
        req,
        SYSTEM_SETTING_KEYS.VERIFICATION_CODE_EXPIRY,
      );

    const beforeExpiry = new Date(
      new Date().getTime() - verificationCodeExpiry * 60 * 1000,
    );
    return createdAt <= beforeExpiry;
  }
}
