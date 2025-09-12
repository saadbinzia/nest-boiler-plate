import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { Attachment, User } from "src/entities";
import { AdminUpdateUserDTO, UserDTO } from "./dto";

import * as bcrypt from "bcrypt";
import { Request } from "express";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { AttachmentService } from "src/modules/shared/attachment/attachment.service";
import { plainToInstance } from "class-transformer";

const { RESPONSE_STATUSES, ACTIVE_STATUSES, REGISTRATION_STATUSES } =
  GlobalEnums;
@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @Inject(forwardRef(() => AttachmentService))
    private _attachmentService: AttachmentService,

    private _globalResponses: GlobalResponses,
  ) {
    super(User);
  }

  async findByEmail(
    req: Request | AuthenticatedRequest,
    email: string,
  ): Promise<object> {
    return this.findOne(req, { email: email.toLowerCase() });
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
    const userExists = await this.findByEmail(req, payload.email);

    // Check if user exists against this email then notify user.
    if (userExists) {
      const error = new Error("email_already_exists");
      error.name = "ConflictError";
      throw error;
    }

    let hashPass = null;

    if (payload.password) {
      hashPass = await bcrypt.hash(payload.password, 10);
    }

    const userPayload = {
      ...payload,
      password: hashPass,
      role: role,
      status: ACTIVE_STATUSES.ACTIVE,
      registrationStatus: REGISTRATION_STATUSES.COMPLETED,
    };

    const userData = plainToInstance(User, userPayload);

    const newUser = await this.create(req, userData);

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    const result = { ...newUser["dataValues"] };

    delete result.password; // Remove the 'password' property

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      result,
      "user_created",
    );
  }

  /**
   * Find
   * @description Find user by id.
   * @param {AuthenticatedRequest} req
   * @returns {Promise<ApiResponse>}
   */
  async find(req: AuthenticatedRequest, userId: number): Promise<ApiResponse> {
    const user = await this.findOne(
      req,
      { id: userId },
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
    payload: AdminUpdateUserDTO,
  ): Promise<ApiResponse> {
    const user = await this.update(req, { id: id }, payload);

    if (!user) {
      const error = new Error("user_not_found");
      error.name = "NotFoundError";
      throw error;
    }

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      user,
      "user_updated",
    );
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
        RESPONSE_STATUSES.SUCCESS,
        attachment,
        "image_uploaded",
      );
    } else {
      const error = new Error("file_not_found");
      error.name = "NotFoundError";
      throw error;
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
      RESPONSE_STATUSES.SUCCESS,
      null,
      "image_deleted",
    );
  }
}
