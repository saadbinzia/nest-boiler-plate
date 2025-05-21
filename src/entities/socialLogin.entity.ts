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
  modelName: "tbl_social_logins",
})
export class SocialLogin extends Model<SocialLogin> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.NUMBER,
    field: "user_id",
  })
  userId: number;
  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.ENUM("facebook", "google", "twitter", "apple"),
  })
  type: string;

  @Column({
    type: DataType.JSON,
    field: "social_login_data",
  })
  socialLoginData: JSON;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;
}
