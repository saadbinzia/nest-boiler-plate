import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  Matches,
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
    pattern: "^[A-Za-z\\s]+$",
  })
  @IsNotEmpty({ message: "First name should not be empty" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "First name should contain only alphabets and spaces",
  })
  readonly firstName: string;

  @ApiProperty({
    description: "Last name (alphabets and spaces only)",
    example: "Doe",
    minLength: 1,
    pattern: "^[A-Za-z\\s]+$",
  })
  @IsNotEmpty({ message: "Last name should not be empty" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Last name should contain only alphabets and spaces",
  })
  readonly lastName: string;

  @ApiPropertyOptional({
    description: "User phone number (optional, international format)",
    example: "+923001234567",
    pattern: "^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$",
  })
  readonly phoneNumber?: string;

  @ApiProperty({
    description:
      "Password (8-32 chars, at least one uppercase, one number, and one symbol)",
    example: "P@ss2word",
    minLength: 8,
    maxLength: 32,
    pattern: "^(?=.*\\d)(?=.*[A-Z])(?=.*[\\W_]).{8,32}$",
  })
  @MinLength(8, { message: "Password should be at least 8 characters long." })
  @MaxLength(32, { message: "Password can't be more than 32 characters." })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,32}$/, {
    message:
      "Password must contain at least one number, one uppercase letter, and one symbol.",
  })
  readonly password?: string;
}
