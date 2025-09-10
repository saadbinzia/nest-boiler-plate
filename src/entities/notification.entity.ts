import {
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "./user.entity";

export enum NotificationType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  SYSTEM = "system",
  PROMOTIONAL = "promotional",
  SECURITY = "security",
  OTHER = "other",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

@Table({
  tableName: "tbl_notifications",
  timestamps: true,
  underscored: true,
  paranoid: false,
  defaultScope: {
    order: [
      ["isRead", "ASC"],
      ["createdAt", "DESC"],
    ],
  },
  indexes: [
    {
      fields: ["user_id"],
    },
    {
      fields: ["is_read"],
    },
    {
      fields: ["type"],
    },
    {
      fields: ["created_at"],
    },
  ],
})
export class Notification extends Model<Notification> {
  @IsString()
  @IsNotEmpty({ message: "Notification title is required" })
  @MaxLength(255, {
    message: "Title must be shorter than or equal to 255 characters",
  })
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: "Title or short description of the notification",
  })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000, {
    message: "Description must be shorter than or equal to 2000 characters",
  })
  @Column({
    type: DataType.STRING(2000),
    allowNull: true,
    comment: "Detailed description of the notification",
  })
  description: string | null;

  @IsIn(Object.values(NotificationType))
  @Column({
    type: DataType.ENUM(...Object.values(NotificationType)),
    allowNull: false,
    defaultValue: NotificationType.INFO,
    comment: "Type/category of the notification",
  })
  type: NotificationType;

  @IsIn(Object.values(NotificationPriority))
  @Column({
    type: DataType.ENUM(...Object.values(NotificationPriority)),
    allowNull: false,
    defaultValue: NotificationPriority.MEDIUM,
    comment: "Priority level of the notification",
  })
  priority: NotificationPriority;

  @IsBoolean()
  @Column({
    type: DataType.BOOLEAN,

    allowNull: false,
    defaultValue: false,
    comment: "Whether the notification has been read",
  })
  isRead: boolean;

  @IsBoolean()
  @Column({
    type: DataType.BOOLEAN,

    allowNull: false,
    defaultValue: false,
    comment: "Whether the notification has been archived",
  })
  isArchived: boolean;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: "Invalid URL format for redirect page" })
  @MaxLength(1000, {
    message: "Redirect URL must be shorter than or equal to 1000 characters",
  })
  @Column({
    type: DataType.STRING(1000),

    allowNull: true,
    comment: "URL to redirect to when the notification is clicked",
  })
  redirectUrl: string | null;

  @IsInt()
  @IsNotEmpty({ message: "User ID is required" })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,

    allowNull: false,
    comment: "ID of the user who will receive this notification",
  })
  userId: number;

  @BelongsTo(() => User, {
    foreignKey: "userId",
    as: "recipient",
  })
  recipient: User;

  @IsDate()
  @Column({
    type: DataType.DATE,

    allowNull: false,
  })
  createdAt: Date;

  @IsDate()
  @Column({
    type: DataType.DATE,

    allowNull: false,
  })
  updatedAt: Date;

  get hasAction(): boolean {
    return !!this.redirectUrl;
  }

  get actionUrl(): string | null {
    return this.redirectUrl || null;
  }

  static async markAsRead(
    notificationIds: number | number[],
  ): Promise<[number, Notification[]]> {
    const ids = Array.isArray(notificationIds)
      ? notificationIds
      : [notificationIds];

    return this.update(
      {
        isRead: true,
      },
      {
        where: {
          id: ids,
          isRead: false,
        },
        returning: true,
      },
    );
  }

  static async markAllAsRead(
    userId: number,
  ): Promise<[number, Notification[]]> {
    return this.update(
      {
        isRead: true,
      },
      {
        where: {
          userId,
          isRead: false,
        },
        returning: true,
      },
    );
  }
}
