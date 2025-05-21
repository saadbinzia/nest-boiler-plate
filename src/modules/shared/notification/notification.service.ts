import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { INotification } from "src/core/config/interface/notification.interface";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { Notification } from "src/entities";

@Injectable()
export class NotificationService extends BaseService {
  constructor(private _globalResponses: GlobalResponses) {
    super(Notification);
  }

  /**
   * Find
   * @description Find notification by id.
   * @param {Request} req
   * @param {Number} notificationId
   * @returns {Promise<ApiResponse>}
   */
  async findNotification(
    req: AuthenticatedRequest,
    notificationId: number,
  ): Promise<ApiResponse> {
    const notification = await this.findOne(
      { id: notificationId, userId: req.user.id },
      null,
      ["id", "title", "description", "redirectPage", "isRead", "otherDetails"],
    );

    return notification
      ? this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          notification,
          "notification_found",
        )
      : this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          "notification_not_found",
        );
  }

  /**
   * Find
   * @description Find notification by id.
   * @param {AuthenticatedRequest} req
   * @returns {Promise<ApiResponse>}
   */
  async findAllNotifications(req: AuthenticatedRequest): Promise<ApiResponse> {
    const notifications = await this.findAll(
      {
        userId: req.user.id,
      },
      null,
      ["id", "title", "description", "redirectPage", "isRead", "otherDetails"],
      [["id", "DESC"]],
    );

    return this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.SUCCESS,
      notifications,
      "notification_fetched",
    );
  }

  /**
   * Read notification
   * @description Read notification record.
   * @returns {Promise<ApiResponse>}
   */
  async readNotification(
    req: AuthenticatedRequest,
    notificationId: number,
  ): Promise<ApiResponse> {
    let response = this._globalResponses.formatResponse(
      req,
      GlobalEnums.RESPONSE_STATUSES.ERROR,
      null,
      null,
    );

    const notification = await this.updateById(notificationId, {
      isRead: true,
    });

    response = notification
      ? this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.SUCCESS,
          null,
          "notification_updated",
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
   * Create notification
   * @description Create new notification record.
   * @param {INotification} payload
   * @return {Promise<void>}
   */
  async createNotification(payload: INotification): Promise<void> {
    const newNotification = await this.create({
      ...payload,
      isRead: false,
    });

    if (newNotification) {
      console.log(0);
    }

    return;
  }
}
