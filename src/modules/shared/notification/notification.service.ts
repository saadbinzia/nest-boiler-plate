import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { BaseService } from "src/core/base/base.service";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { INotification } from "src/core/config/interface/notification.interface";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { Notification } from "src/entities";

const { RESPONSE_STATUSES } = GlobalEnums;
@Injectable()
export class NotificationService extends BaseService<Notification> {
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
      req,
      { id: notificationId, userId: req.user.id },
      {
        attributes: [
          "id",
          "title",
          "description",
          "redirectUrl",
          "isRead",
          // "otherDetails",
        ],
      },
    );

    if (!notification) {
      const error = new Error("notification_not_found");
      error.name = "NotFoundError";
      throw error;
    }

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      notification,
      "notification_found",
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
      req,
      {
        userId: req.user.id,
      },
      {
        attributes: [
          "id",
          "title",
          "description",
          "redirectUrl",
          "isRead",
          // "otherDetails",
        ],
        order: [["id", "DESC"]],
      },
    );

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
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
    const notification = await this.updateById(req, notificationId, {
      isRead: true,
    });

    if (!notification) {
      const error = new Error("notification_not_found");
      error.name = "NotFoundError";
      throw error;
    }

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      null,
      "notification_updated",
    );
  }

  /**
   * Create notification
   * @description Create new notification record.
   * @param {INotification} payload
   * @return {Promise<void>}
   */
  async createNotification(
    req: AuthenticatedRequest,
    payload: INotification,
  ): Promise<void> {
    try {
      // Optional transformation step if INotification is a DTO
      const notificationData = plainToInstance(Notification, payload);

      const newNotification = await this.create(req, notificationData);

      if (newNotification) {
        console.log("Notification created");
      }
    } catch (error) {
      console.error("Failed to create notification:", error);
    }

    return;
  }
}
