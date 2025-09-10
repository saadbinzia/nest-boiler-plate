import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
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
import {
  GlobalEnums,
  TVerificationCodeStatus,
  TVerificationCode,
} from "src/core/config/globalEnums";

const { VERIFICATION_CODE_STATUS, VERIFICATION_CODE_TYPE } = GlobalEnums;
@Table({
  tableName: "tbl_user_verification_codes",
  timestamps: true,
  underscored: true,
  paranoid: false,
  defaultScope: {
    order: [["createdAt", "DESC"]],
  },
  indexes: [
    {
      fields: ["user_id"],
    },
    {
      fields: ["code"],
    },
    {
      fields: ["type"],
    },
  ],
})
export class UserVerificationCode extends Model<UserVerificationCode> {
  @IsInt()
  @IsNotEmpty({ message: "User ID is required" })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,

    allowNull: false,
    comment: "ID of the user this verification code belongs to",
  })
  userId: number;

  @BelongsTo(() => User, {
    foreignKey: "userId",
    as: "user",
  })
  user: User;

  @IsString()
  @IsNotEmpty({ message: "Verification code is required" })
  @MinLength(4, { message: "Code must be at least 4 characters long" })
  @MaxLength(20, { message: "Code must not exceed 20 characters" })
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    comment: "The verification code",
  })
  code: string;

  @IsString()
  @IsNotEmpty({ message: "Verification UUID is required" })
  @MinLength(4, { message: "UUID must be at least 4 characters long" })
  @MaxLength(256, { message: "UUID must not exceed 256 characters" })
  @Column({
    type: DataType.STRING(256),
    allowNull: false,
    comment: "The verification UUID",
  })
  uuid: string;

  @IsIn(Object.values(VERIFICATION_CODE_STATUS))
  @Column({
    type: DataType.ENUM(...Object.values(VERIFICATION_CODE_STATUS)),
    allowNull: false,
    defaultValue: VERIFICATION_CODE_STATUS.PENDING,
    comment: "Current status of the verification code",
  })
  status: TVerificationCodeStatus;

  @IsIn(Object.values(VERIFICATION_CODE_TYPE))
  @Column({
    type: DataType.ENUM(...Object.values(VERIFICATION_CODE_TYPE)),
    allowNull: false,
    comment: "Type of verification code",
  })
  type: TVerificationCode;

  @IsDate()
  @Column({
    type: DataType.DATE,

    allowNull: false,
    comment: "When the verification code expires",
  })
  expiresAt: Date;

  @IsDate()
  @IsOptional()
  @Column({
    type: DataType.DATE,

    allowNull: true,
    comment: "When the code was verified",
  })
  verifiedAt: Date | null;

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

  // ====================== VIRTUAL FIELDS ======================

  get isExpired(): boolean {
    return (
      this.status === VERIFICATION_CODE_STATUS.EXPIRED ||
      (this.expiresAt && this.expiresAt <= new Date())
    );
  }

  get isVerified(): boolean {
    return this.status === VERIFICATION_CODE_STATUS.VERIFIED;
  }

  get canBeUsed(): boolean {
    return !this.isExpired && this.status === VERIFICATION_CODE_STATUS.PENDING;
  }

  // ====================== CLASS METHODS ======================

  static async markAsUsed(
    id: number,
    userId: number,
  ): Promise<[affectedCount: number]> {
    return this.update(
      {
        status: VERIFICATION_CODE_STATUS.USED,
        verifiedAt: new Date(),
      },
      {
        where: {
          id,
          userId,
          status: VERIFICATION_CODE_STATUS.PENDING,
        },
      },
    ) as unknown as Promise<[affectedCount: number]>;
  }
}
