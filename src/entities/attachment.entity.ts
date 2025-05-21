import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  modelName: "tbl_attachments",
})
export class Attachment extends Model<Attachment> {
  @Column({
    type: DataType.STRING,
  })
  parent: string;

  @Column({
    type: DataType.NUMBER,
    field: "parent_id",
  })
  parentId: string;

  @Column({
    type: DataType.STRING,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    field: "file_original_name",
  })
  fileOriginalName: string;

  @Column({
    type: DataType.STRING,
    field: "file_path",
  })
  filePath: string;

  @Column({
    type: DataType.STRING,
    field: "file_unique_name",
  })
  fileUniqueName: string;

  @Column({
    type: DataType.NUMBER,
    field: "created_by",
  })
  createdBy: number;

  @Column({
    type: DataType.NUMBER,
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
}
