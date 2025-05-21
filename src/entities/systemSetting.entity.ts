import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  modelName: "tbl_system_settings",
})
export class SystemSetting extends Model<SystemSetting> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  key: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  value: string;

  @Column({
    type: DataType.STRING,
    field: "value_type",
  })
  valueType: string;

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
}
