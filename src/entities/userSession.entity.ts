import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "./index";

@Table({
  modelName: "tbl_user_sessions",
})
export class UserSession extends Model<UserSession> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.NUMBER,
    field: "user_id",
  })
  userId: number;
  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.TEXT,
    field: "auth_token",
  })
  authToken: string;

  @Column({
    type: DataType.STRING,
    field: "status",
  })
  status: string;

  @Column({
    type: DataType.STRING,
    field: "browser",
  })
  browser: string;

  @Column({
    type: DataType.STRING,
    field: "public_ip",
  })
  publicIp: string;

  @Column({
    type: DataType.STRING,
    field: "operating_system",
  })
  operatingSystem: string;

  @Column({
    type: DataType.BOOLEAN,
    field: "remember_me",
  })
  rememberMe: boolean;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;
}
