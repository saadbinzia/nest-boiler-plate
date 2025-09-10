import { IsDate, IsIn, IsInt, IsNotEmpty, IsString } from "class-validator";
import {
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from "sequelize-typescript";
import { User } from "./user.entity";
import {
  GlobalEnums,
  TAttachmentParent,
  TAttachmentTypes,
} from "src/core/config/globalEnums";

const { ATTACHMENT_PARENT, ATTACHMENT_TYPES } = GlobalEnums;

@DefaultScope(() => ({
  attributes: {
    exclude: ["createdBy", "updatedBy"],
  },
}))
@Scopes(() => ({
  withUser: {
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "email", "firstName", "lastName"],
      },
    ],
  },
  withAll: {
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "email", "firstName", "lastName"],
      },
    ],
  },
}))
@Table({
  tableName: "tbl_attachments",
  timestamps: true,
  underscored: true,
  paranoid: false,
})
export class Attachment extends Model<Attachment> {
  @IsString()
  @IsNotEmpty({ message: "Parent type is required" })
  @IsIn([...Object.values(ATTACHMENT_PARENT)])
  @Column({
    type: DataType.ENUM(...Object.values(ATTACHMENT_PARENT)),
    allowNull: false,
    comment: "The parent entity type this attachment belongs to",
  })
  parent: TAttachmentParent;

  @IsInt()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: "The ID of the parent entity",
  })
  parentId: number;

  @IsString()
  @IsNotEmpty({ message: "Attachment type is required" })
  @IsIn([...Object.values(ATTACHMENT_TYPES)])
  @Column({
    type: DataType.ENUM(...Object.values(ATTACHMENT_TYPES)),
    allowNull: false,
    defaultValue: ATTACHMENT_TYPES.OTHER,
    comment: "The type of the attachment",
  })
  type: TAttachmentTypes;

  @IsString()
  @IsNotEmpty({ message: "Original file name is required" })
  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    comment: "Original name of the uploaded file",
  })
  fileOriginalName: string;

  @IsString()
  @IsNotEmpty({ message: "File path is required" })
  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
    comment: "Relative path to the stored file",
  })
  filePath: string;

  @IsString()
  @IsNotEmpty({ message: "Unique file name is required" })
  @Column({
    type: DataType.STRING(255),
    unique: true,
    allowNull: false,
    comment: "Unique name generated for the stored file",
  })
  fileUniqueName: string;

  @IsInt()
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: "ID of the user who uploaded this file",
  })
  createdBy: number;

  @IsInt()
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: "ID of the user who last updated this record",
  })
  updatedBy: number;

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

  get fullUrl(): string {
    return this.filePath ? `${process.env.APP_URL || ""}/${this.filePath}` : "";
  }
}
