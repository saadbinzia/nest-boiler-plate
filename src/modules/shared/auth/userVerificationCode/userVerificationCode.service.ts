import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Op } from "sequelize";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { User, UserVerificationCode } from "src/entities";
import { MailService } from "src/modules/mail/mail.service";
import { UserService } from "../../user/user.service";
import {
  VerificationCodeStatusEnum,
  VerificationCodeTypeEnum,
} from "./interface/userVerificationCode.interface";
import { Request } from "express";
import { v1 as uuidv1 } from "uuid";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { SystemSettingService } from "src/core/config/systemSetting.service";

/**
 * User Verification Code Service
 */
@Injectable()
export class UserVerificationCodeService extends BaseService {
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
   * Create Verification Code
   * @description This function will create a new verification code for specific type and expire all previously added codes for that specific type.
   * @param {VerificationCodeStatusEnum} codeStatus
   * @param {VerificationCodeTypeEnum} type
   * @param {Request} req
   * @param {string} code
   * @param {number} userId
   * @returns {Promise<object>}
   */
  async createVerificationCode(
    req: Request,
    userId: number,
    code: string,
    type: VerificationCodeTypeEnum,
    uuid?: string,
  ): Promise<object> {
    const payload = {
      publicIp:
        req.headers["x-forwarded-for"] || req?.connection?.remoteAddress || "",
      browser: req?.headers["sec-ch-ua"] ? req.headers["sec-ch-ua"] : "",
      operatingSystem: req?.headers["sec-ch-ua-platform"]
        ? req.headers["sec-ch-ua-platform"]
        : "",
    };

    const alreadyExists = await this.findAll({
      userId: userId,
      type: type,
      codeStatus: {
        [Op.not]: VerificationCodeStatusEnum.EXPIRED,
      },
    });

    if (alreadyExists.length > 0) {
      const promiseArr = [];
      alreadyExists.forEach((item) => {
        promiseArr.push(
          this.updateById(item.id, {
            codeStatus: VerificationCodeStatusEnum.EXPIRED,
          }),
        );
      });

      promiseArr.push(
        this.create({
          userId,
          code,
          codeStatus: VerificationCodeStatusEnum.SENT,
          type,
          uuid,
          ...payload,
        }),
      );
      return await Promise.all(promiseArr);
    } else {
      return await this.create({
        userId,
        code,
        codeStatus: VerificationCodeStatusEnum.SENT,
        type,
        uuid,
        ...payload,
      });
    }
  }

  /**
   * Generate Unique Code
   * @description This function can be used to generate a 4 digit random code that is unique for its specific code type
   * @param {VerificationCodeTypeEnum} type
   * @returns {Promise<string>}
   */
  async generateUniqueCode(type: VerificationCodeTypeEnum): Promise<string> {
    try {
      let code: string;
      let isUnique = false;

      // Generate a unique 5-digit code
      while (!isUnique) {
        code = this.generateRandomCode();
        const existingEntity = await this.findOne({
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
    const idExist = await this.findOne({ uuid: uid });
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
   * @param {VerificationCodeTypeEnum} type
   * @returns {Promise<ApiResponse>}
   */
  async sendVerificationEmail(
    req: Request,
    email: string,
    type: VerificationCodeTypeEnum,
  ): Promise<ApiResponse> {
    const user = await this._userService.findOne({
      email: email.toLowerCase(),
    });

    const verificationCodeExpiry =
      await this._systemSettingService.getNumberValueByKey(
        GlobalEnums.SYSTEM_SETTING_KEYS.VERIFICATION_CODE_EXPIRY,
      );

    if (user) {
      const code = await this.generateUniqueCode(type);
      const uuid = await this.generateUUId(req);

      await this.createVerificationCode(
        req,
        user.id,
        code.toString(),
        type,
        uuid,
      );

      if (type === VerificationCodeTypeEnum.FORGET_PASSWORD) {
        this._mailService.sendEmail(
          "forget-password",
          email,
          "Reset your password",
          {
            username: user.firstName,
            email: user.email,
            code: code,
            resetLink: `${process.env["APP_URL"]}/auth/reset-password?uuid=${uuid}`,
            logoImage: `${process.env["API_URL"]}/static/email/logo.png`,
            expiry: verificationCodeExpiry,
            supportMail: process.env["MAIL_SUPPORT"],
          },
        );
      } else {
        this._mailService.sendEmail(
          "registration-code",
          email,
          "Your verification code",
          {
            username: user.firstName,
            email: user.email,
            code: code,
            resetLink: `${process.env["APP_URL"]}/verify-email/success?uuid=${uuid}`,
            logoImage: `${process.env["API_URL"]}/static/email/logo.png`,
            expiry: verificationCodeExpiry,
            supportMail: process.env["MAIL_SUPPORT"],
          },
        );
      }

      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.SUCCESS,
        null,
        "email_sent",
      );
    }

    return this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.ERROR,
      null,
      "user_not_found",
    );
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
    type: VerificationCodeTypeEnum,
  ): Promise<ApiResponse> {
    const codeRecord = await this.findOne({ code, type }, [
      {
        model: User,
        where: {
          email: email.toLowerCase(),
        },
      },
    ]);

    if (codeRecord) {
      const verificationCodeExpiry =
        await this._systemSettingService.getNumberValueByKey(
          GlobalEnums.SYSTEM_SETTING_KEYS.VERIFICATION_CODE_EXPIRY,
        );

      const beforeExpiry = new Date(
        new Date().getTime() - verificationCodeExpiry * 60 * 1000,
      );
      if (
        codeRecord.codeStatus !== VerificationCodeStatusEnum.SENT ||
        codeRecord.createdAt <= beforeExpiry
      ) {
        await this.updateById(codeRecord.id, {
          codeStatus: VerificationCodeStatusEnum.EXPIRED,
        });
        return this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          "verification_code_expired",
        );
      }

      await this.updateOne(
        { code: code, codeStatus: VerificationCodeStatusEnum.SENT },
        { codeStatus: VerificationCodeStatusEnum.VALIDATED },
      );

      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.SUCCESS,
        {},
        "auth_code_verified",
      );
    } else {
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "invalid_verification_code",
      );
    }
  }
}
