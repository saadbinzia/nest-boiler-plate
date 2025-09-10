import { forwardRef, Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { Attachment, User } from "src/entities";
import { AttachmentService } from "../attachment/attachment.service";
import { UserVerificationCodeService } from "../auth/userVerificationCode/userVerificationCode.service";
import { ChangeUserPasswordDTO, ResendCodeDTO, UpdateUserDTO } from "./dto";

const { RESPONSE_STATUSES, REGISTRATION_STATUSES, VERIFICATION_CODE_TYPE } =
  GlobalEnums;

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @Inject(forwardRef(() => AttachmentService))
    private _attachmentService: AttachmentService,
    @Inject(forwardRef(() => UserVerificationCodeService))
    private _userVerificationCodeService: UserVerificationCodeService,
    private _globalResponses: GlobalResponses,
  ) {
    super(User);
  }

  /**
   * Find
   * @description Find user by id.
   * @param {AuthenticatedRequest} req
   * @returns {Promise<ApiResponse>}
   */
  async find(req: AuthenticatedRequest): Promise<ApiResponse> {
    const user = await this.findOne(
      req,
      { id: req.user.id },
      {
        include: [
          {
            model: Attachment,
            as: "profileImage",
            attributes: ["filePath", "fileUniqueName"],
          },
        ],
        attributes: [
          "id",
          "firstName",
          "lastName",
          "phoneNumber",
          "email",
          "role",
          "registrationStatus",
        ],
      },
    );

    if (!user) {
      const error = new Error("user_not_found");
      error.name = "NotFoundError";
      throw error;
    }

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      user,
      "user_found",
    );
  }

  /**
   * Update user
   * @description Update user record on given condition.
   * @param {number} id
   * @param {UpdateUserDTO} payload
   * @returns {Promise<ApiResponse>}
   */
  async updateUser(
    req: Request,
    id: number,
    payload: UpdateUserDTO,
  ): Promise<ApiResponse> {
    const [, [user]] = await this.update(req, { id }, {
      ...payload,
      updatedAt: new Date(),
    } as any);

    if (!user) {
      const error = new Error("user_not_found");
      error.name = "NotFoundError";
      throw error;
    }
    delete user.dataValues.password;

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      user,
      "user_updated",
    );
  }

  /**
   * Update user
   * @description Update user record on given condition.
   * @param {number} id
   * @param {ChangeUserPasswordDTO} payload
   * @returns {Promise<ApiResponse>}
   */
  async changePassword(
    req: Request,
    id: number,
    payload: ChangeUserPasswordDTO,
  ): Promise<ApiResponse> {
    const user = await this.findOne(
      req,
      { id },
      { attributes: { include: ["password"] } },
    );

    if (!user) {
      const error = new Error("user_not_found");
      error.name = "NotFoundError";
      throw error;
    }

    const match = await bcrypt.compare(
      payload.oldPassword,
      user?.password ?? "",
    );

    if (!match) {
      const error = new Error("old_password_invalid");
      error.name = "BadRequestError";
      throw error;
    }

    if (payload.oldPassword === payload.newPassword) {
      const error = new Error("old_and_new_password_are_same");
      error.name = "BadRequestError";
      throw error;
    }

    const password = await bcrypt.hash(payload.newPassword, 10);
    await this.update(req, { id }, { password, updatedAt: new Date() });

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      null,
      "password_changed_successfully",
    );
  }

  /**
   * Resend a verification code to the user
   *
   * @param {ResendCodeDTO} body - the user's email
   * @return {Promise<any>} a promise representing the result of resending the code
   */
  async resendRegistrationCode(
    req: Request,
    body: ResendCodeDTO,
  ): Promise<any> {
    const user = await this.findOne(req, { email: body.email.toLowerCase() });

    if (user) {
      if (
        user.registrationStatus === REGISTRATION_STATUSES.PENDING.toString()
      ) {
        await this._userVerificationCodeService.createVerificationCodeByEmail(
          req,
          user.email,
          VERIFICATION_CODE_TYPE.REGISTRATION,
        );
        return this._globalResponses.formatResponse(
          req,
          RESPONSE_STATUSES.SUCCESS,
          null,
          "registration_code_sent_again",
        );
      } else {
        const error = new Error("user_already_verified");
        error.name = "BadRequestError";
        throw error;
      }
    } else {
      const error = new Error("user_not_found");
      error.name = "NotFoundError";
      throw error;
    }
  }

  /**
   * Uploads profile image for user.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {Express.Multer.File} file - The uploaded file.
   * @return {Promise<object>} - A promise that resolves to an object with the status and data of the upload.
   */
  async uploadImage(
    req: AuthenticatedRequest,
    file: Express.Multer.File,
  ): Promise<object> {
    if (file) {
      const attachment = await this._attachmentService.addImageAttachment(
        req,
        req.user.id,
        "users",
        "profile",
        file,
      );

      return this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.SUCCESS,
        attachment,
        "image_uploaded",
      );
    } else {
      const error = new Error("file_not_found");
      error.name = "BadRequestError";
      throw error;
    }
  }

  /**
   * Delete the profile image for user.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @return {Promise<object>} - A promise that resolves to an object with the status and data of the upload.
   */
  async deleteImage(req: AuthenticatedRequest): Promise<object> {
    await this._attachmentService.removeAttachment(
      req,
      req.user.id,
      "users",
      "profile",
    );

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      null,
      "image_deleted",
    );
  }
}
