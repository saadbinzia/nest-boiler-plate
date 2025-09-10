import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Request } from "express";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums, TVerificationCode } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { SystemSettingService } from "src/core/config/systemSetting.service";
import { UserVerificationCode } from "src/entities";

import { MailService } from "src/modules/mail/mail.service";
import { UserService } from "../../user/user.service";
import { v1 as uuidv1 } from "uuid";

const {
  VERIFICATION_CODE_TYPE,
  VERIFICATION_CODE_STATUS,
  SYSTEM_SETTING_KEYS,
  RESPONSE_STATUSES,
} = GlobalEnums;

/**
 * Service for handling user verification codes
 * @extends BaseService<UserVerificationCode>
 */
@Injectable()
export class UserVerificationCodeService extends BaseService<UserVerificationCode> {
  constructor(
    @Inject(forwardRef(() => MailService))
    private _mailService: MailService,
    @Inject(forwardRef(() => UserService))
    private _userService: UserService,
    @Inject(forwardRef(() => SystemSettingService))
    private _systemSettingService: SystemSettingService,
    private _globalResponses: GlobalResponses,
  ) {
    super(UserVerificationCode);
  }

  /**
   * Create a new verification code for a user
   * @param {Request} req - The request object
   * @param {number} userId - The ID of the user
   * @param {TVerificationCode} type - The type of verification code
   * @returns {Promise<UserVerificationCode>} Promise resolving to the created verification code
   */
  async createVerificationCodeByUser(
    req: Request,
    userId: number,
    type: TVerificationCode,
  ): Promise<UserVerificationCode> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes from now

    // Expire any existing verification codes for this user and type
    await this.update(
      req,
      {
        userId,
        type,
        status: VERIFICATION_CODE_STATUS.PENDING,
      },
      { status: VERIFICATION_CODE_STATUS.EXPIRED },
    );

    // Create a new verification code
    return await this.create(req, {
      code: await this.generateUniqueCode(req, type),
      uuid: await this.generateUUId(req),
      type,
      userId,
      status: VERIFICATION_CODE_STATUS.PENDING,
      expiresAt,
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
      // The following fields are required by the model but will be set by Sequelize
      user: undefined as any,
    } as UserVerificationCode);
  }

  /**
   * Generate Unique Code
   * @description This function can be used to generate a 4 digit random code that is unique for its specific code type
   * @param {VerificationCodeType} type - The type of verification code
   * @returns {Promise<string>} A unique verification code
   */
  async generateUniqueCode(
    req: Request,
    type: TVerificationCode,
  ): Promise<string> {
    try {
      let code: string;
      let isUnique = false;

      // Generate a unique 5-digit code
      while (!isUnique) {
        code = this.generateRandomCode();
        const existingEntity = await this.findOne(req, {
          code,
          type,
        });
        isUnique = !existingEntity;
      }

      return code;
    } catch (error) {
      return error;
    }
  }

  /**
   * Generate Random Code
   * @description This function will generate a random 4 digits string
   * @returns {string}
   */
  generateRandomCode(): string {
    const min = 0;
    const max = 9999;

    // Generate a random number between min and max
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    // Pad the number with leading zeros to ensure it's 5 digits long
    const paddedNumber = randomNumber.toString().padStart(5, "0");

    return paddedNumber;
  }

  /**
   * Generate verification link
   * @description generate unique verification link so user can verify account using link.
   * @param {Request} req
   * @returns {Promise<string>}
   */
  async generateUUId(req: Request): Promise<string> {
    const uid = uuidv1();
    const idExist = await this.findOne(req, { uuid: uid });
    if (!idExist) {
      return uid;
    } else {
      return this.generateUUId(req);
    }
  }

  /**
   * Send Verification Email
   * @description This function sends a verification email to the user with the code and type
   * @param {string} email
   * @param {TVerificationCode} type
   * @returns {Promise<ApiResponse>}
   */
  async createVerificationCodeByEmail(
    req: Request,
    email: string,
    type: TVerificationCode,
  ): Promise<ApiResponse> {
    const user = await this._userService.findOne(req, {
      email: email.toLowerCase(),
    });

    const verificationCodeExpiry =
      await this._systemSettingService.getNumberValueByKey(
        req,
        SYSTEM_SETTING_KEYS.VERIFICATION_CODE_EXPIRY,
      );

    if (user) {
      const codeRecord = await this.createVerificationCodeByUser(
        req,
        user.id,
        type,
      );

      if (type === VERIFICATION_CODE_TYPE.PASSWORD_RESET) {
        this._mailService.sendEmail(
          email,
          "Reset your password",
          "forget-password",
          {
            username: user.firstName,
            email: user.email,
            code: codeRecord.code,
            resetLink: `${process.env["APP_URL"]}/auth/reset-password?uuid=${codeRecord.uuid}`,
            logoImage: `${process.env["API_URL"]}/static/email/logo.png`,
            expiry: verificationCodeExpiry,
            supportMail: process.env["MAIL_SUPPORT"],
          },
        );
      } else {
        this._mailService.sendEmail(
          email,
          "Your verification code",
          "registration-code",
          {
            username: user.firstName,
            email: user.email,
            code: codeRecord.code,
            resetLink: `${process.env["APP_URL"]}/verify-email/success?uuid=${codeRecord.uuid}`,
            logoImage: `${process.env["API_URL"]}/static/email/logo.png`,
            expiry: verificationCodeExpiry,
            supportMail: process.env["MAIL_SUPPORT"],
          },
        );
      }

      return this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.SUCCESS,
        null,
        "email_sent",
      );
    }
    const error = new Error("user_not_found");
    error.name = "NotFoundError";
    throw error;
  }

  /**
   * Verify user code for a given email and code type
   * @param email - The email of the user
   * @param code - The verification code
   * @param type - The type of verification code
   * @returns A response indicating the success or failure of the code verification
   */

  async verifyUserCode(
    req: Request,
    email: string,
    code: string,
    type: TVerificationCode,
  ): Promise<ApiResponse> {
    const codeRecord = await this.findOne(req, { code, type });

    if (codeRecord) {
      const verificationCodeExpiry =
        await this._systemSettingService.getNumberValueByKey(
          req,
          SYSTEM_SETTING_KEYS.VERIFICATION_CODE_EXPIRY,
        );

      const beforeExpiry = new Date(
        new Date().getTime() - verificationCodeExpiry * 60 * 1000,
      );
      if (codeRecord.status === VERIFICATION_CODE_STATUS.PENDING) {
        if (codeRecord.createdAt <= beforeExpiry) {
          await this.update(
            req,
            { id: (codeRecord as any).id },
            { status: VERIFICATION_CODE_STATUS.EXPIRED },
          );
          const error = new Error("verification_code_expired");
          error.name = "BadRequestError";
          throw error;
        }

        // Update verification code status to VALIDATED
        await this.update(
          req,
          { id: (codeRecord as any).id },
          { status: VERIFICATION_CODE_STATUS.VERIFIED },
        );
        return this._globalResponses.formatResponse(
          req,
          RESPONSE_STATUSES.SUCCESS,
          {},
          "auth_code_verified",
        );
      } else {
        await this.updateById(req, codeRecord.id, {
          status: VERIFICATION_CODE_STATUS.EXPIRED,
        });
        const error = new Error("verification_code_expired");
        error.name = "BadRequestError";
        throw error;
      }
    } else {
      const error = new Error("invalid_verification_code");
      error.name = "BadRequestError";
      throw error;
    }
  }
}
