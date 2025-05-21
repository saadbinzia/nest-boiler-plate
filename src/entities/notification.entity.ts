import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user.entity";

@Table({
  modelName: "tbl_notifications",
})
export class Notification extends Model<Notification> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    field: "redirect_page",
  })
  redirectPage: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: "is_read",
  })
  isRead: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: "user_id",
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.JSON,
    field: "other_details",
  })
  otherDetails: object;

  @Column({
    type: DataType.BIGINT,
    field: "created_by",
  })
  createdBy: number;

  @Column({
    type: DataType.BIGINT,
    field: "updated_by",
  })
  updatedBy: number;

  @Column({
    type: DataType.DATE,
    field: "createdAt",
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: "updatedAt",
  })
  updatedAt: Date;
}
