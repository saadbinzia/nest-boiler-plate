import {
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
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
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { NotificationService } from "./notification.service";

@ApiTags("Notification")
@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly _notificationService: NotificationService,
    private readonly _globalResponses: GlobalResponses,
  ) {}

  /**
   * Find
   * @description Find notification by id.
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @param {{notificationId: string}} param
   * @returns {Promise<JSON>}
   */
  @Get("find/:notificationId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiParam({
    name: "notificationId",
    type: String,
    description: "The notification id",
    required: true,
  })
  @ApiOperation({
    summary: "Find notification by id",
    description: "Find notification by id",
  })
  @ApiResponse({
    status: 200,
    description: "Notification found successfully",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  async findNotification(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Param() { notificationId }: { notificationId: string },
  ): Promise<object> {
    try {
      const response = await this._notificationService.findNotification(
        req,
        +notificationId,
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
   * Find all
   * @description Find all notifications.
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @returns {Promise<JSON>}
   */
  @Get("find-all")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Find all notifications",
    description: "Find all notifications even if not authorized.",
  })
  @ApiResponse({
    status: 200,
    description: "Notifications found successfully",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  async findeAllNotifications(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<object> {
    try {
      const response =
        await this._notificationService.findAllNotifications(req);
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
   * Read Notification
   * @description Read notification.
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @returns {Promise<JSON>}
   */
  @UseGuards(JwtAuthGuard)
  @Put("read-notification/:notificationId")
  @ApiOperation({
    summary: "Update notification read status",
    description: "Update Notification read status.",
  })
  @ApiResponse({
    status: 200,
    description: "Updated successfully",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 422,
    description: "Unprocessable Entity",
    type: UnprocessableResponse,
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
    name: "notificationId",
    type: String,
    description: "The notification id",
    required: true,
  })
  @ApiBearerAuth("access-token")
  async readNotification(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Param() { notificationId }: { notificationId: string },
  ): Promise<object> {
    try {
      const response = await this._notificationService.readNotification(
        req,
        +notificationId,
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
