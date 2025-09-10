import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
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

export enum SettingValueType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  JSON = "json",
  ARRAY = "array",
  URL = "url",
  EMAIL = "email",
  IP = "ip",
  DATE = "date",
  DATETIME = "datetime",
  TIMESTAMP = "timestamp",
  COLOR = "color",
  PASSWORD = "password",
  TEXT = "text",
  HTML = "html",
  MARKDOWN = "markdown",
  FILE = "file",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  OTHER = "other",
}

@Table({
  tableName: "tbl_system_settings",
  timestamps: true,
  paranoid: true,
  underscored: true,
  comment: "System configuration settings",
  defaultScope: {
    attributes: {
      exclude: ["deletedAt"],
    },
    order: [["key", "ASC"]],
  },
  indexes: [
    {
      fields: ["key"],
      unique: true,
    },
    {
      fields: ["group"],
    },
    {
      fields: ["is_active"],
    },
    {
      fields: ["is_public"],
    },
  ],
})
export class SystemSetting extends Model<SystemSetting> {
  @IsString()
  @IsNotEmpty({ message: "Setting key is required" })
  @MaxLength(255, { message: "Key must not exceed 255 characters" })
  @Column({
    type: DataType.STRING(255),
    unique: true,
    allowNull: false,
    comment: "Unique key for the setting",
    validate: {
      notEmpty: { msg: "Key cannot be empty" },
      len: {
        args: [2, 255],
        msg: "Key must be between 2 and 255 characters",
      },
      is: {
        args: /^[a-z0-9_]+(\.[a-z0-9_]+)*$/i,
        msg: "Key can only contain alphanumeric characters, dots, and underscores",
      },
    },
  })
  key: string;

  @IsString()
  @IsOptional()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment:
      "The value of the setting (stored as string, parsed based on valueType)",
  })
  value: string | null;

  @IsIn(Object.values(SettingValueType))
  @Column({
    type: DataType.ENUM(...Object.values(SettingValueType)),
    allowNull: false,
    defaultValue: SettingValueType.STRING,
    comment: "The data type of the setting value",
  })
  valueType: SettingValueType;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: "Description must not exceed 1000 characters" })
  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
    comment: "Description of what this setting does",
  })
  description: string | null;

  @IsInt()
  @IsOptional()
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,

    allowNull: true,
    comment: "ID of the user who created this setting",
  })
  createdBy: number | null;

  @BelongsTo(() => User, {
    foreignKey: "createdBy",
    as: "creator",
  })
  creator: User | null;

  @IsInt()
  @IsOptional()
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,

    allowNull: true,
    comment: "ID of the user who last updated this setting",
  })
  updatedBy: number | null;

  @BelongsTo(() => User, {
    foreignKey: "updatedBy",
    as: "updater",
  })
  updater: User | null;

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
  })
  deletedAt: Date | null;

  // ====================== VIRTUAL FIELDS ======================

  get parsedValue(): any {
    if (this.value === null || this.value === undefined) {
      return null;
    }

    try {
      switch (this.valueType) {
        case SettingValueType.NUMBER:
          return Number(this.value);
        case SettingValueType.BOOLEAN:
          return (
            this.value === "true" || this.value === "1" || this.value === "yes"
          );
        case SettingValueType.JSON:
          return JSON.parse(this.value);
        case SettingValueType.ARRAY:
          return Array.isArray(this.value) ? this.value : [this.value];
        case SettingValueType.DATE:
        case SettingValueType.DATETIME:
        case SettingValueType.TIMESTAMP:
          return new Date(this.value);
        default:
          return this.value;
      }
    } catch (error) {
      console.error(
        `Error parsing setting ${this.key} with value ${this.value}`,
        error,
      );
      return this.value;
    }
  }

  // ====================== CLASS METHODS ======================

  static async getValue<T = any>(
    key: string,
    defaultValue: T = null,
  ): Promise<T> {
    const setting = await this.findOne({
      where: { key },
    });

    if (!setting) {
      return defaultValue;
    }

    return setting.parsedValue as T;
  }

  static async setValue(
    key: string,
    value: any,
    userId?: number,
  ): Promise<SystemSetting> {
    const [setting] = await this.upsert({
      key,
      value: String(value),
      valueType: this.determineValueType(value),
      updatedBy: userId,
    });

    return setting;
  }

  private static determineValueType(value: any): SettingValueType {
    if (value === null || value === undefined) {
      return SettingValueType.STRING;
    }

    switch (typeof value) {
      case "number":
        return SettingValueType.NUMBER;
      case "boolean":
        return SettingValueType.BOOLEAN;
      case "object":
        if (Array.isArray(value)) {
          return SettingValueType.ARRAY;
        }
        return SettingValueType.JSON;
      case "string":
        // Try to detect type from string content
        if (/^\d+$/.test(value)) {
          return SettingValueType.NUMBER;
        } else if (value === "true" || value === "false") {
          return SettingValueType.BOOLEAN;
        } else if (value.match(/^https?:\/\//)) {
          return SettingValueType.URL;
        } else if (value.includes("@") && value.includes(".")) {
          return SettingValueType.EMAIL;
        } else if (value.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
          return SettingValueType.IP;
        } else if (value.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
          return SettingValueType.COLOR;
        } else if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return SettingValueType.DATE;
        } else if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
          return SettingValueType.DATETIME;
        } else if (value.match(/^<[a-z][\s\S]*>$/i)) {
          return SettingValueType.HTML;
        }
        return SettingValueType.STRING;
      default:
        return SettingValueType.STRING;
    }
  }

  static async getGroupedSettings(): Promise<Record<string, any>> {
    const settings = await this.findAll({
      order: [["key", "ASC"]],
    });
    return { settings };
  }

  static async clearCache(): Promise<void> {
    // Clear any cached settings if needed
    // This is a placeholder for actual cache clearing logic
    console.log("Cache cleared");
  }
}
