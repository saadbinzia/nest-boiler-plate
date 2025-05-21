import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { Attachment, User } from "src/entities";
import { UpdateUserDTO, UserDTO } from "./dto";

import * as bcrypt from "bcrypt";
import { Request } from "express";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { AttachmentService } from "src/modules/shared/attachment/attachment.service";

@Injectable()
export class UserService extends BaseService {
  constructor(
    @Inject(forwardRef(() => AttachmentService))
    private _attachmentService: AttachmentService,

    private _globalResponses: GlobalResponses,
  ) {
    super(User);
  }

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
  async createUser(
    req: Request,
    payload: UserDTO,
    role: string,
  ): Promise<ApiResponse> {
    let response = this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.ERROR,
      null,
      null,
    );

    const userExists = await this.findByEmail(payload.email);

    // Check if user exists against this email then notify user.
    if (userExists) {
      response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "email_already_exists",
      );
    } else {
      let hashPass = null;

      if (payload.password) {
        hashPass = await bcrypt.hash(payload.password, 10);
      }

      const userPayload = {
        ...payload,
        password: hashPass,
        role: role,
        status: GlobalEnums.ACTIVE_STATUSES.ACTIVE,
        username: await this.generateUsername(payload.firstName),
        registrationStatus:
          GlobalEnums.REGISTRATION_STATUSES.REGISTRATION_COMPLETED,
      };

      const newUser = await this.create(userPayload);

      if (newUser) {
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

  /**
   * Find
   * @description Find user by id.
   * @param {AuthenticatedRequest} req
   * @returns {Promise<ApiResponse>}
   */
  async find(req: AuthenticatedRequest, userId: number): Promise<ApiResponse> {
    const user = await this.findOne(
      { id: userId },
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
   * Uploads profile image for user.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {Express.Multer.File} file - The uploaded file.
   * @return {Promise<object>} - A promise that resolves to an object with the status and data of the upload.
   */
  async uploadImage(
    req: AuthenticatedRequest,
    file: Express.Multer.File,
    userId: number,
  ): Promise<object> {
    if (file) {
      const attachment = await this._attachmentService.addImageAttachment(
        req,
        userId,
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
  async deleteImage(
    req: AuthenticatedRequest,
    userId: number,
  ): Promise<object> {
    await this._attachmentService.removeAttachment(
      req,
      userId,
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
