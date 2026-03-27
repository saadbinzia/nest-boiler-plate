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
import { GCSService } from "src/modules/shared/gcs/gcs.service";
import { plainToInstance } from "class-transformer";
import { GetUsersQueryDTO } from "./dto/getUserQuerry.dto";
import { Op } from "sequelize";

const {
  RESPONSE_STATUSES,
  ACTIVE_STATUSES,
  REGISTRATION_STATUSES,
  USER_ROLES,
} = GlobalEnums;
@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @Inject(forwardRef(() => AttachmentService))
    private _attachmentService: AttachmentService,

    private _globalResponses: GlobalResponses,
    private _gcsService: GCSService,
  ) {
    super(User);
  }

  // Helper Functions
  private async searchAndPaginateUsers(
    req: AuthenticatedRequest,
    where: any,
    page: number,
    limit: number | undefined,
    q?: string,
    sortBy: string = "createdAt",
    sortOrder: "ASC" | "DESC" = "DESC",
  ) {
    if (q?.trim()) {
      const likeOp = (Op as any).iLike || Op.like;
      const pattern = `%${q.trim()}%`;
      where[Op.or] = [
        { fullName: { [likeOp]: pattern } },
        { email: { [likeOp]: pattern } },
      ];
    }

    const queryOptions: any = {
      attributes: [
        "id",
        "email",
        "role",
        "fullName",
        "status",
        "registrationStatus",
        "createdAt",
        "updatedAt",
      ],
      distinct: true,
      order: [[sortBy, sortOrder]],
    };

    let rows: any[];
    let meta: any;

    // If limit is provided, use pagination; otherwise return all results
    if (limit !== undefined && limit !== null) {
      const result = await this.paginate(req, where, page, limit, queryOptions);
      rows = result.rows;
      meta = result.meta;
    } else {
      // Return all results without pagination
      const { rows: allRows, count } = await this.findAndCountAll(
        req,
        where,
        queryOptions,
      );
      rows = allRows;
      meta = {
        total: count,
        page: 1,
        limit: count,
        pages: 1,
      };
    }

    // Add activeSpacesCount to each user
    const usersWithActiveSpacesCount = rows.map((user: any) => {
      const activeSpacesCount = user.leases ? user.leases.length : 0;

      // Remove the leases array from the response to keep it clean
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { leases, ...userWithoutLeases } = user.toJSON
        ? user.toJSON()
        : user;

      return {
        ...userWithoutLeases,
        activeSpacesCount,
      };
    });

    return { rows: usersWithActiveSpacesCount, meta };
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
   * Get All users
   * @description Get All Users (search + pagination)
   * @param {AuthenticatedRequest} req
   * @returns {Promise<ApiResponse>}
   */
  async getAllStaff(
    req: AuthenticatedRequest,
    params: GetUsersQueryDTO = { page: 1, limit: 10 },
  ): Promise<ApiResponse> {
    const {
      page = 1,
      limit = 10,
      q,
      role,
      status,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = params;

    // WHERE
    const where: any = { id: { [Op.ne]: req.user.id } };

    const roles = Array.isArray(role) ? role : role ? [role] : [];
    if (roles.length) {
      where.role = { [Op.in]: roles, [Op.ne]: USER_ROLES.USER };
    } else {
      where.role = { [Op.ne]: USER_ROLES.USER };
    }

    if (status !== undefined && status !== null && status !== ("" as any)) {
      where.status = status;
    }

    const { rows, meta } = await this.searchAndPaginateUsers(
      req,
      where,
      page,
      limit,
      q,
      sortBy,
      sortOrder,
    );

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      { rows, meta },
      "users_listed",
    );
  }

  /**
   * Get All users
   * @description Get All Users (search + pagination)
   * @param {AuthenticatedRequest} req
   * @returns {Promise<ApiResponse>}
   */
  async getAllUsers(
    req: AuthenticatedRequest,
    params: GetUsersQueryDTO = { page: 1 },
  ): Promise<ApiResponse> {
    const {
      page = 1,
      limit,
      q,
      role,
      status,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = params;

    // WHERE
    const where: any = {};

    const roles = Array.isArray(role) ? role : role ? [role] : [];
    const exclude = [USER_ROLES.ADMIN];
    if (roles.length) {
      where.role = { [Op.in]: roles.filter((r) => !exclude.includes(r)) };
    } else {
      where.role = { [Op.notIn]: exclude };
    }

    if (status !== undefined && status !== null && status !== ("" as any)) {
      where.status = status;
    }

    const { rows, meta } = await this.searchAndPaginateUsers(
      req,
      where,
      page,
      limit,
      q,
      sortBy,
      sortOrder,
    );

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      { rows, meta },
      "users_listed",
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
        true,
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

  /**
   * Delete the user.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {number} userId - The user ID.
   * @return {Promise<object>} - A promise that resolves to an object with the status and data of the upload.
   */
  async deleteUser(req: AuthenticatedRequest, userId: number): Promise<object> {
    // Get the target user to check their role
    const targetUser = await User.findByPk(userId);

    if (!targetUser) {
      const error = new Error("user_not_found");
      error.name = "NotFoundError";
      throw error;
    }

    await this.delete(req, { id: userId });

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      null,
      "user_deleted",
    );
  }

  // ==================== Document Management ====================
}
