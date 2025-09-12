import { forwardRef, Inject, Injectable, Req } from "@nestjs/common";
import { Request } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { Attachment } from "src/entities";
import { SharedAuthService } from "src/modules/shared/auth/auth.service";
import { UserService } from "../user/user.service";
import { AdminAuthDto } from "./dto/auth.dto";
import { Op } from "sequelize";

const { USER_ROLES, RESPONSE_STATUSES } = GlobalEnums;
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly _userService: UserService,
    @Inject(forwardRef(() => SharedAuthService))
    private readonly _sharedAuthService: SharedAuthService,
    private readonly _globalResponses: GlobalResponses,
  ) {}

  /**
   * Login
   * @description User can login from app end.
   * @param {AuthDto} payload
   * @param {Request} request
   * @returns {Promise<ApiResponse>}
   */
  public async login(
    payload: AdminAuthDto,
    @Req() request: Request,
  ): Promise<ApiResponse> {
    return await this.validateUser(payload, request);
  }

  /**
   * Validate user
   * @description Validate user login credentials and generate token.
   * @param {AuthDto} payload
   * @param {Request} request
   * @returns {Promise<ApiResponse>}
   */
  async validateUser(
    payload: AdminAuthDto,
    request?: Request,
  ): Promise<ApiResponse> {
    const user = await this._userService.findOne(
      request,
      {
        email: payload.email.toLowerCase(),
        role: {
          [Op.in]: [
            USER_ROLES.SUPER_ADMIN,
            USER_ROLES.MANAGER,
            USER_ROLES.STAFF,
          ],
        },
      },
      {
        include: [
          {
            model: Attachment,
            as: "profileImage",
            attributes: ["filePath", "fileUniqueName"],
          },
        ],
        attributes: [
          "firstName",
          "lastName",
          "password",
          "id",
          "email",
          "registrationStatus",
          "role",
        ],
      },
    );

    if (!user) {
      const error = new Error("invalid_user_credentials");
      throw error;
    }

    const match = await this._sharedAuthService.comparePassword(
      payload.password,
      user?.password ?? "",
    );

    if (!match) {
      const error = new Error("invalid_user_credentials");
      throw error;
    }

    const result = user["dataValues"];
    delete result.password;

    const token = await this._sharedAuthService.createToken(
      request,
      user.id,
      user.email,
      user.role,
      payload.rememberMe,
    );

    return this._globalResponses.formatResponse(
      request,
      RESPONSE_STATUSES.SUCCESS,
      { token: token, user: result },
      "user_login",
    );
  }
}
