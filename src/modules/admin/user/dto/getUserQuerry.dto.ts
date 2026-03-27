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
  IsIn,
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
    description:
      "Number of users per page (max 100). If not provided, returns all results.",
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

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
    example: ["ADMIN"],
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

  @ApiPropertyOptional({
    example: 10,
    description: "Filter by status (10 = Active, 20 = Inactive)",
    enum: [10, 20],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([10, 20])
  status?: number;

  @ApiPropertyOptional({
    example: "fullName",
    description: "Sort by field (fullName, email, status, createdAt)",
  })
  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt";

  @ApiPropertyOptional({
    example: "DESC",
    description: "Sort order (ASC or DESC)",
    enum: ["ASC", "DESC"],
  })
  @IsOptional()
  @IsString()
  @IsIn(["ASC", "DESC"])
  sortOrder?: "ASC" | "DESC" = "DESC";
}
