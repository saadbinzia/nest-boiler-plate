import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import {
  ErrorResponse,
  SuccessResponse,
  unAuthorizedResponse,
} from "src/core/config/interface/swaggerResponse.dto";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { UserSessionService } from "./userSession/userSession.service";

@ApiTags("Auth for simple user")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly _userSessionService: UserSessionService,
    private readonly _globalResponses: GlobalResponses,
  ) {}

  /**
   * Logout session
   * @description Logout from active session
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @returns {Promise<JSON>}
   */
  @Get("logout-session")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Logout current session",
    description: "Log out the current session the user is logged in.",
  })
  @ApiResponse({
    status: 200,
    description: "Logout successful",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiBearerAuth("access-token")
  async logoutSession(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<object> {
    try {
      const response = await this._userSessionService.logoutSession(req);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );
      return res.status(response.statusCode).json(response);
    }
  }

  /**
   * Logout All Sessions
   * @description Logout from all active sessions.
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @returns {Promise<JSON>}
   */
  @Get("logout-all-sessions")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Logout all session",
    description: "Log out all session.",
  })
  @ApiResponse({
    status: 200,
    description: "Logout successful",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiBearerAuth("access-token")
  async logoutAllSessions(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<object> {
    try {
      const response = await this._userSessionService.logoutAllSessions(
        req,
        req.user.id,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );
      return res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get Active Instances
   * @description Get user active Instances.
   * @param {Response} res
   * @param {Request} req
   * @returns {Promise<JSON>}
   */
  @Get("get-active-instances")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get Active instances",
    description: "Get Active instances.",
  })
  @ApiResponse({
    status: 200,
    description: "Actie instances fetched",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiBearerAuth("access-token")
  async getActiveInstances(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<object> {
    try {
      const response = await this._userSessionService.getActiveInstances(
        req,
        req.user.id,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );
      return res.status(response.statusCode).json(response);
    }
  }

  /**
   * Logout specific session
   * @description Logout from active session
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @returns {Promise<JSON>}
   */
  @Get("logout-specific-session/:sessionId")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Logout from specific session",
    description: "Log out from specific.",
  })
  @ApiResponse({
    status: 200,
    description: "Logout successful",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiParam({
    name: "sessionId",
    type: String,
    description: "The session id",
    required: true,
  })
  @ApiBearerAuth("access-token")
  async logoutSpecificSession(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Param() param,
  ): Promise<object> {
    try {
      const response = await this._userSessionService.logoutSpecificSession(
        req,
        param.sessionId,
      );

      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );
      return res.status(response.statusCode).json(response);
    }
  }
}
