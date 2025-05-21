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
import { VerificationCodeTypeEnum } from "../auth/userVerificationCode/interface/userVerificationCode.interface";
import { UserVerificationCodeService } from "../auth/userVerificationCode/userVerificationCode.service";
import { ChangeUserPasswordDTO, ResendCodeDTO, UpdateUserDTO } from "./dto";

@Injectable()
export class UserService extends BaseService {
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
      { id: req.user.id },
      {
        model: Attachment,
        as: "profileImage",
        attributes: ["filePath", "fileUniqueName"],
      },
      [
        "id",
        "firstName",
        "lastName",
        "phoneNumber",
        "email",
        "role",
        "username",
        "preferredLanguage",
        "referralUser",
        "registrationStatus",
      ],
    );
    return user
      ? this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          user,
          "user_found",
        )
      : this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          "user_not_found",
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
    let response = this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.ERROR,
      null,
      null,
    );

    const user = await this.updateOne({ id: id }, payload);
    response = user
      ? this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          user,
          "user_updated",
        )
      : this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          null,
        );

    return response;
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
    let response = this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.ERROR,
      null,
      null,
    );

    if (payload.oldPassword === payload.newPassword) {
      response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "old_and_new_password_are_same",
      );

      return response;
    }

    const user = await this.findOne({ id: id });
    if (!user) {
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "user_not_found",
      );
    }

    const match = await bcrypt.compare(
      payload.oldPassword,
      user?.password ?? "",
    );

    if (!match) {
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "old_password_invalid",
      );
    }

    const password = await bcrypt.hash(payload.newPassword, 10);
    await this.updateById(id, { password: password });

    response = this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.SUCCESS,
      null,
      "password_changed_successfully",
    );

    return response;
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
    const user = await this.findOne({ email: body.email.toLowerCase() });

    if (user) {
      if (
        user.registrationStatus ==
        GlobalEnums.REGISTRATION_STATUSES.REGISTRATION_STARTED
      ) {
        await this._userVerificationCodeService.sendVerificationEmail(
          req,
          body.email.toLowerCase(),
          VerificationCodeTypeEnum.REGISTRATION,
        );
        return this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          null,
          "registration_code_sent_again",
        );
      } else {
        return this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          "user_already_verified",
        );
      }
    } else {
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "user_not_found",
      );
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
        GlobalEnums.RESPONSE_STATUSES.SUCCESS,
        attachment,
        "image_uploaded",
      );
    } else {
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "file_not_found",
      );
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
      GlobalEnums.RESPONSE_STATUSES.SUCCESS,
      null,
      "image_deleted",
    );
  }
}
