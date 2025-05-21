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

@Injectable()
export class UserSessionService extends BaseService {
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
    let response = this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.ERROR,
      null,
      null,
    );

    const userSession = await this.create(payload);

    response = userSession
      ? this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          null,
          "session_created",
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
   * Logout session
   * @description Logout user from active session.
   * @param {AuthenticatedRequest} req
   * @returns {Promise<ApiResponse>}
   */
  async logoutSession(req: AuthenticatedRequest): Promise<ApiResponse> {
    let response = this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.ERROR,
      null,
      null,
    );

    const token = this._helperService.extractTokenFromHeader(req);

    const expireSession = await this.updateOne(
      { authToken: token, userId: req.user.id },
      {
        status: GlobalEnums.USER_SESSION_STATUS.EXPIRED,
      },
    );

    await this._cacheService.deleteSession(token);

    response = expireSession
      ? this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          null,
          "logout_from_device",
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
    let response = this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.ERROR,
      null,
      null,
    );

    const userSession = await this.findAll({
      userId: userId,
      status: GlobalEnums.USER_SESSION_STATUS.ACTIVE,
    });

    if (userSession && userSession.length) {
      for (let index = 0; index < userSession.length; index++) {
        const element = userSession[index];
        await this.updateById(element.id, {
          status: GlobalEnums.USER_SESSION_STATUS.EXPIRED,
        });

        await this._cacheService.deleteSession(element.authToken);
      }

      response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.SUCCESS,
        null,
        "logout_from_all_devices",
      );
    } else {
      response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        {},
        "device_not_found",
      );
    }

    return response;
  }

  /**
   * find session
   * @description Used to find session record.
   * @param {String} token
   * @returns {Promise<ApiResponse>}
   */
  async findSession(token: string): Promise<ApiResponse> {
    return await this.findOne({ authToken: token });
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
      { userId: userId, status: GlobalEnums.USER_SESSION_STATUS.ACTIVE },
      null,
      ["id", "authToken", "browser", "publicIp", "operatingSystem"],
      [["id", "DESC"]],
    );

    for (let index = 0; index < activeSessions.length; index++) {
      const activeSession = activeSessions[index];

      const token = this._helperService.extractTokenFromHeader(req);

      activeSession.dataValues.isCurrent = activeSession.authToken === token;
      delete activeSession.dataValues.authToken;
    }

    return activeSessions.length
      ? this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          activeSessions,
          "active_sessions_found",
        )
      : this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          "no_active_session",
        );
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
    let response = this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.ERROR,
      null,
      null,
    );

    const session = await this.findOneById(sessionId);

    const expireSession = await this.updateOne(
      { id: sessionId },
      {
        status: GlobalEnums.USER_SESSION_STATUS.EXPIRED,
      },
    );

    await this._cacheService.deleteSession(session.authToken);

    response = expireSession
      ? this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          null,
          "logout_from_device",
        )
      : this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          null,
        );

    return response;
  }
}
