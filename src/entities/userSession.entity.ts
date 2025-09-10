import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsIn,
  IsBoolean,
} from "class-validator";
import { User } from "./user.entity";
import { GlobalEnums, TSessionStatus } from "src/core/config/globalEnums";

const { SESSION_STATUS } = GlobalEnums;
@Table({
  tableName: "tbl_user_sessions",
  timestamps: true,
  underscored: true,
  paranoid: false,
  defaultScope: {
    attributes: {
      exclude: ["authToken"],
    },
  },
  indexes: [
    {
      fields: ["user_id"],
    },
    {
      fields: ["auth_token"],
      unique: true,
    },
  ],
})
export class UserSession extends Model<UserSession> {
  @IsInt()
  @IsNotEmpty({ message: "User ID is required" })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: "ID of the user this session belongs to",
  })
  userId: number;
  @BelongsTo(() => User, {
    foreignKey: "userId",
    as: "user",
  })
  user: User;

  @IsString()
  @IsNotEmpty({ message: "Authentication token is required" })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: "JWT or other authentication token",
  })
  authToken: string;

  @IsIn(Object.values(SESSION_STATUS))
  @Column({
    type: DataType.ENUM(...Object.values(SESSION_STATUS)),
    allowNull: false,
    defaultValue: SESSION_STATUS.ACTIVE,
    comment: "Current status of the session",
  })
  status: TSessionStatus;

  @IsBoolean()
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  rememberMe: boolean;

  @IsString()
  @IsOptional()
  @Column({
    type: DataType.STRING(1000),
    comment: "User agent string of the client",
  })
  userAgent: string;

  @IsString()
  @IsOptional()
  @Column({
    type: DataType.STRING(1000),
    comment: "Browser name of the client",
  })
  browser: string;

  @IsString()
  @IsOptional()
  @Column({
    type: DataType.STRING(1000),
    comment: "Public IP address of the client",
  })
  publicIp: string;

  @IsString()
  @IsOptional()
  @Column({
    type: DataType.STRING(1000),
    comment: "Operating system of the client",
  })
  operatingSystem: string;

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

  @IsDate()
  @IsOptional()
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: "When the session was manually revoked",
  })
  revokedAt: Date | null;
}
