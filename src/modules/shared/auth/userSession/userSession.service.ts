import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { UserSession } from "src/entities";
import { UserSessionDTO } from "../../user/dto";
import { Request } from "express";
import { CacheService } from "src/modules/shared/cache/cache.service";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";

const { RESPONSE_STATUSES, SESSION_STATUS } = GlobalEnums;
@Injectable()
export class UserSessionService extends BaseService<UserSession> {
  constructor(
    private _globalResponses: GlobalResponses,
    private _helperService: HelperService,
    private _cacheService: CacheService,
  ) {
    super(UserSession);
  }

  /**
   * Create session
   * @description Create an active session on user login.
   * @param {Request} req Request Parameter
   * @param {UserSessionDTO} payload
   * @returns {Promise<ApiResponse>}
   */
  async createSession(
    req: Request,
    payload: UserSessionDTO,
  ): Promise<ApiResponse> {
    try {
      // Transform DTO to plain object if needed (optional with class-transformer)

      // Create session using Sequelize
      await this.create(req, payload as any);

      return this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.SUCCESS,
        null,
        "session_created",
      );
    } catch (error) {
      // Optional: log or rethrow error
      console.error("Session creation failed:", error);
      throw error;
    }
  }

  /**
   * Logout session
   * @description Logout user from active session.
   * @param {AuthenticatedRequest} req
   * @returns {Promise<ApiResponse>}
   */
  async logoutSession(req: AuthenticatedRequest): Promise<ApiResponse> {
    const token = this._helperService.extractTokenFromHeader(req);

    const expireSession = await this.update(
      req,
      { authToken: token, userId: req.user.id },
      {
        status: SESSION_STATUS.EXPIRED,
      },
    );

    await this._cacheService.deleteSession(token);

    if (!expireSession) {
      throw new Error("session_not_found");
    }

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      null,
      "logout_from_device",
    );
  }

  /**
   * Logout all session
   * @description Logout from all user active sessions.
   * @param {AuthenticatedRequest} req
   * @param {number} userId
   * @returns {Promise<ApiResponse>}
   */
  async logoutAllSessions(
    req: AuthenticatedRequest | Request,
    userId: number,
  ): Promise<ApiResponse> {
    const userSession = await this.findAll(req, {
      userId: userId,
      status: SESSION_STATUS.ACTIVE,
    });

    if (userSession && userSession.length) {
      for (let index = 0; index < userSession.length; index++) {
        const element = userSession[index];
        await this.updateById(req, element.id, {
          status: SESSION_STATUS.EXPIRED,
        });

        await this._cacheService.deleteSession(element.authToken);
      }

      return this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.SUCCESS,
        null,
        "logout_from_all_devices",
      );
    }

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      null,
      "logout_from_all_devices",
    );
  }

  /**
   * find session
   * @description Used to find session record.
   * @param {String} token
   * @returns {Promise<UserSession>}
   */
  async findSession(
    req: AuthenticatedRequest,
    token: string,
  ): Promise<UserSession> {
    return await this.findOne(req, { authToken: token });
  }

  /**
   * User Active Instances
   * @description get user active instances.
   * @param {AuthenticatedRequest} req
   * @param {Number} userId
   * @returns {Promise<ApiResponse>}
   */
  async getActiveInstances(
    req: AuthenticatedRequest,
    userId: number,
  ): Promise<ApiResponse> {
    const activeSessions = await this.findAll(
      req,
      { userId: userId, status: SESSION_STATUS.ACTIVE },
      {
        attributes: [
          "id",
          "authToken",
          "browser",
          "publicIp",
          "operatingSystem",
        ],
        order: [["id", "DESC"]],
      },
    );

    if (activeSessions.length) {
      return this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.SUCCESS,
        activeSessions,
        "active_sessions_found",
      );
    } else {
      const error = new Error("no_active_session");
      error.name = "NotFoundError";
      throw error;
    }
  }

  /**
   * Logout specific session
   * @description Logout user from specific session.
   * @param {AuthenticatedRequest} req
   * @param {number} sessionId
   * @returns {Promise<ApiResponse>}
   */
  async logoutSpecificSession(
    req: AuthenticatedRequest,
    sessionId: number,
  ): Promise<ApiResponse> {
    const session = await this.findOneById(req, sessionId);

    const expireSession = await this.update(
      req,
      { id: sessionId },
      {
        status: SESSION_STATUS.EXPIRED,
      },
    );

    await this._cacheService.deleteSession(session.authToken);

    if (!expireSession) {
      const error = new Error("session_not_found");
      error.name = "NotFoundError";
      throw error;
    }

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      null,
      "logout_from_device",
    );
  }
}
