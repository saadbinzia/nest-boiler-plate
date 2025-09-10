import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import {
  Column,
  DataType,
  DefaultScope,
  HasMany,
  HasOne,
  Model,
  Scopes,
  Table,
} from "sequelize-typescript";
import {
  GlobalEnums,
  TActiveStatus,
  TRegistrationStatus,
  TUserRole,
} from "src/core/config/globalEnums";
import {
  Attachment,
  Notification,
  SocialLogin,
  UserSession,
  UserVerificationCode,
} from "./index";

const { USER_ROLES, ACTIVE_STATUSES, REGISTRATION_STATUSES } = GlobalEnums;

@DefaultScope(() => ({
  attributes: { exclude: ["password"] }, // Exclude password by default
  include: [
    {
      model: Attachment,
      as: "profileImage",
      required: false,
    },
  ],
}))
@Scopes(() => ({
  withPassword: {
    attributes: { include: ["password"] },
  },
  withSessions: {
    include: [{ model: UserSession }],
  },
}))
@Table({
  tableName: "tbl_users",
  timestamps: true,
  underscored: true,
  paranoid: true, // Enable soft deletes
})
export class User extends Model<User> {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  })
  email: string;

  @IsString()
  @Length(8, 100, { message: "Password must be between 8 and 100 characters" })
  @Column({
    type: DataType.STRING,
    allowNull: true, // Allow null for OAuth users
    validate: {
      notEmpty: {
        msg: "Password cannot be empty",
      },
    },
  })
  password: string;

  @IsIn(Object.values(USER_ROLES))
  @Column({
    type: DataType.ENUM(...Object.values(USER_ROLES)),
    allowNull: false,
    defaultValue: USER_ROLES.USER,
  })
  role: TUserRole;

  @IsString()
  @Length(1, 100, {
    message: "First name must be between 1 and 100 characters",
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName: string;

  @IsString()
  @Length(1, 100, { message: "Last name must be between 1 and 100 characters" })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @IsIn(Object.values(ACTIVE_STATUSES))
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: ACTIVE_STATUSES.ACTIVE,
    validate: {
      isIn: [Object.values(ACTIVE_STATUSES).map(Number)],
    },
  })
  status: TActiveStatus;

  @IsString()
  @IsOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      is: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
    },
  })
  phoneNumber: string;

  @IsIn(Object.values(REGISTRATION_STATUSES))
  @Column({
    type: DataType.ENUM(...Object.values(REGISTRATION_STATUSES)),
    allowNull: false,
    defaultValue: REGISTRATION_STATUSES.PENDING,
  })
  registrationStatus: TRegistrationStatus;

  @IsBoolean()
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  agreeTermsAndConditions: boolean;

  @IsInt()
  @IsOptional()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  createdBy: number;

  @IsInt()
  @IsOptional()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  updatedBy: number;

  @IsDate()
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @IsDate()
  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @IsDate()
  @IsOptional()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt: Date;

  // ====================== RELATIONSHIPS ======================

  @HasMany(() => UserSession)
  sessions: UserSession[];

  @HasMany(() => Notification)
  notifications: Notification[];

  @HasMany(() => SocialLogin)
  socialLogins: SocialLogin[];

  @HasMany(() => UserVerificationCode)
  verificationCodes: UserVerificationCode[];

  @HasOne(() => Attachment, {
    sourceKey: "id",
    foreignKey: "parentId",
    scope: {
      parent: "users",
      type: "profile",
    },
    as: "profileImage",
    constraints: false,
  })
  profileImage: Attachment;


  // ====================== VIRTUAL FIELDS ======================

  get fullName(): string {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
  }

  get isSuperAdmin(): boolean {
    return this.role === USER_ROLES.SUPER_ADMIN;
  }
}
