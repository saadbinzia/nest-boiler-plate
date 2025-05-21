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
  modelName: "tbl_user_verification_codes",
})
export class UserVerificationCode extends Model<UserVerificationCode> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.NUMBER,
    field: "user_id",
  })
  userId: number;
  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "code",
  })
  code: string;

  @Column({
    type: DataType.ENUM("SENT", "VALIDATED", "EXPIRED"),
    allowNull: false,
    field: "code_status",
  })
  codeStatus: string;

  @Column({
    type: DataType.ENUM("FORGET_PASSWORD", "REGISTRATION"),
    allowNull: false,
    field: "type",
  })
  type: string;

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
    type: DataType.STRING,
    field: "uuid",
  })
  uuid: string;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;
}
