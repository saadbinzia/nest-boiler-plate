import {
  IsString,
  Matches,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ImageDTO {
  @ApiProperty({
    description: "Path to the file relative to the uploads folder",
    example: "images/avatar.jpg",
  })
  @IsString()
  @Matches(/^[a-zA-Z0-9_\-/.]+$/, {
    message:
      "File path can only contain letters, numbers, underscores, hyphens, slashes, and dots",
  })
  @IsNotEmpty({ message: "File path is required" })
  readonly path: string;

  @ApiProperty({
    description: "Force file download instead of display in browser",
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly download?: boolean;
}
