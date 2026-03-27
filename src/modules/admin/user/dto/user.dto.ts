import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";

/**
 * User DTO (Data Transfer Object)
 * @description User DTO is utilized to validate the user create/update request data before invoking the controller function.
 * Used at the beginning of the process.
 */
export class UserDTO {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
    format: "email",
  })
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: "First name (alphabets and spaces only)",
    example: "John",
    minLength: 1,
  })
  @IsNotEmpty({ message: "First name should not be empty" })
  readonly fullName: string;

  @ApiProperty({
    description: "Last name (alphabets and spaces only)",
    example: "Doe",
    minLength: 1,
  })
  @ApiPropertyOptional({
    description: "User role",
    example: "staff",
    enum: ["USER", "ADMIN"],
  })
  readonly role?: string;

  @IsOptional({ message: "Password is optional" })
  @ApiProperty({
    description: "Password (8-32 chars)",
    example: "P@ss2word",
    minLength: 8,
    maxLength: 32,
  })
  @MinLength(8, { message: "Password should be at least 8 characters long." })
  @MaxLength(32, { message: "Password can't be more than 32 characters." })
  readonly password?: string;
}
