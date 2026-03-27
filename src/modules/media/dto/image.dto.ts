import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ImageDTO {
  @ApiProperty({
    description: "Path to the file relative to the uploads folder",
    example: "images/avatar.jpg",
  })
  @IsString()
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
