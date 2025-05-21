import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import { Attachment, UserSession } from "./index";

@Table({
  modelName: "tbl_users",
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: string;

  @Column({
    type: DataType.STRING,
    field: "first_name",
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    field: "last_name",
  })
  lastName: string;

  @Column({
    type: DataType.INTEGER,
  })
  status: number;

  @Column({
    type: DataType.STRING,
    field: "phone_number",
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    field: "registration_status",
  })
  registrationStatus: string;

  @Column({
    type: DataType.STRING,
  })
  username: string;

  @Column({
    type: DataType.BOOLEAN,
    field: "keep_user_updated",
    defaultValue: false,
  })
  keepUserUpdated: number;

  @Column({
    type: DataType.INTEGER,
    field: "agree_terms_and_conditions",
    defaultValue: false,
  })
  agreeTermsAndConditions: number;

  @Column({
    type: DataType.STRING,
    field: "referral_user",
  })
  referralUser: string;
  @BelongsTo(() => User, { foreignKey: "referralUser", targetKey: "username" })
  referralUserData: User;

  @Column({
    type: DataType.STRING,
    field: "preferred_language",
  })
  preferredLanguage: string;

  @Column({
    type: DataType.INTEGER,
    field: "created_by",
  })
  createdBy: number;

  @Column({
    type: DataType.INTEGER,
    field: "updated_by",
  })
  updatedBy: number;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @HasMany(() => UserSession)
  UserSessions: UserSession;

  @HasMany(() => User, { sourceKey: "username", foreignKey: "referralUser" })
  referralUsers: User[];

  @HasOne(() => Attachment, {
    sourceKey: "id",
    foreignKey: "parentId",
    scope: {
      parent: "users",
      type: "profile",
    },
  })
  profileImage: Attachment;
}
