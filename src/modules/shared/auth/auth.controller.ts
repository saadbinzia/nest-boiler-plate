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

const { RESPONSE_STATUSES } = GlobalEnums;
@ApiTags("Auth for all users")
@Controller("shared/auth")
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
  ): Promise<void> {
    try {
      const response = await this._userSessionService.logoutSession(req);
      res.status(response.statusCode).json(response);
    } catch (error) {
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
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
  ): Promise<void> {
    try {
      const response = await this._userSessionService.logoutAllSessions(
        req,
        req.user.id,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
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
  ): Promise<void> {
    try {
      const response = await this._userSessionService.getActiveInstances(
        req,
        req.user.id,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
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
  ): Promise<void> {
    try {
      const response = await this._userSessionService.logoutSpecificSession(
        req,
        param.sessionId,
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }
}
