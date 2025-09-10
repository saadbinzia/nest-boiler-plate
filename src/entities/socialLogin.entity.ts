import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
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

export enum SocialProvider {
  FACEBOOK = "facebook",
  GOOGLE = "google",
  TWITTER = "twitter",
  APPLE = "apple",
  GITHUB = "github",
  LINKEDIN = "linkedin",
  MICROSOFT = "microsoft",
  INSTAGRAM = "instagram",
  GITLAB = "gitlab",
  BITBUCKET = "bitbucket",
  SPOTIFY = "spotify",
  DISCORD = "discord",
  TWITCH = "twitch",
  SLACK = "slack",
  OTHER = "other",
}

export interface SocialProfileData {
  id: string;
  name?: string;
  photoURL?: string;
  [key: string]: any;
}

@Table({
  tableName: "tbl_social_logins",
  timestamps: true,
  underscored: true,
  paranoid: false,
  defaultScope: {
    attributes: {
      exclude: ["accessToken", "refreshToken", "idToken", "socialProfileData"],
    },
  },
  indexes: [
    {
      fields: ["user_id"],
    },
  ],
})
export class SocialLogin extends Model<SocialLogin> {
  @IsIn(Object.values(SocialProvider))
  @Column({
    type: DataType.ENUM(...Object.values(SocialProvider)),
    allowNull: false,
    comment: "The social provider (e.g., google, facebook)",
  })
  provider: SocialProvider;

  @IsString()
  @IsOptional()
  @Column({
    type: DataType.TEXT,

    allowNull: true,
    comment: "OAuth access token",
  })
  accessToken: string | null;

  @IsString()
  @IsOptional()
  @Column({
    type: DataType.TEXT,

    allowNull: true,
    comment: "OAuth refresh token",
  })
  refreshToken: string | null;

  @IsString()
  @IsOptional()
  @Column({
    type: DataType.TEXT,

    allowNull: true,
    comment: "OAuth ID token (JWT)",
  })
  idToken: string | null;

  @IsObject()
  @IsOptional()
  @Column({
    type: DataType.JSONB,

    allowNull: true,
    comment: "Raw profile data from the social provider",
    get() {
      const value = this.getDataValue("socialProfileData");
      return value || {};
    },
    set(value: SocialProfileData) {
      this.setDataValue("socialProfileData", value || {});
    },
  })
  socialProfileData: SocialProfileData;

  @IsInt()
  @IsNotEmpty({ message: "User ID is required" })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,

    allowNull: false,
    comment: "ID of the user this social login is linked to",
  })
  userId: number;

  @BelongsTo(() => User, {
    foreignKey: "userId",
    as: "user",
  })
  user: User;

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
    comment: "When this social login was last used",
  })
  lastUsedAt: Date | null;

  // ====================== VIRTUAL FIELDS ======================

  get profilePicture(): string | null {
    return this.socialProfileData?.photoURL || null;
  }

  // ====================== CLASS METHODS ======================

  static async findByProvider(
    provider: SocialProvider,
    userId: number,
  ): Promise<SocialLogin | null> {
    return this.findOne({
      where: {
        provider,
        userId,
      },
      include: ["user"],
    });
  }
}
