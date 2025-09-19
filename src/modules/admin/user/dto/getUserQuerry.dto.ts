import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  IsArray,
} from "class-validator";

export class GetUsersQueryDTO {
  @ApiPropertyOptional({ example: 1, description: "Page number (1-indexed)" })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: "Number of users per page (max 100)",
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: "john",
    description: "Search by name, email, or phone",
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: "Filter by role(s)",
    isArray: true,
    type: String,
    example: ["super_admin", "admin"],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null || value === "") return undefined;
    return [String(value)];
  })
  @IsArray()
  @IsString({ each: true })
  role?: string[];

  @ApiPropertyOptional({ example: "ACTIVE", description: "Filter by status" })
  @IsOptional()
  @IsString()
  status?: string;
}
