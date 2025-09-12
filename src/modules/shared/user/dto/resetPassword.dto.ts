import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";

/**
 * Forget password DTO (Data Transfer Object)
 * @description Forget password DTO is utilized to validate the forget password request data before invoking the controller function.
 * Used at the beginning of the process.
 */
export class SharedResetPasswordDTO {
  @ApiPropertyOptional({
    description:
      "Verification code sent to the user's email (required if UUID is not provided)",
    example: "482915",
  })
  @ValidateIf((o) => o.uuid === undefined)
  @IsNotEmpty({ message: "Code is required" })
  @IsString({ message: "Verification code should be a string." })
  readonly code: string;

  @ApiPropertyOptional({
    description:
      "Verification UUID received via email link (required if Code is not provided)",
    example: "3ebf45a0-8f9f-11f0-954e-55596a440691",
  })
  @ValidateIf((o) => o.code === undefined)
  @IsNotEmpty({ message: "UUID is required" })
  @IsString({ message: "Verification uuid should be a string." })
  readonly uuid: string;

  @ApiProperty({
    description:
      "New password that user wants to set. Must contain at least 1 uppercase letter, 1 number, and 1 special character.",
    example: "P@ssw0rd123",
    minLength: 8,
    maxLength: 32,
  })
  @IsNotEmpty({ message: "Password fields can't be empty." })
  @MinLength(8, { message: "Password should be at least 8 characters long." })
  @MaxLength(32, { message: "Password can't be more than 32 characters." })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,32}$/, {
    message:
      "Password must contain at least one number, one uppercase letter, and one symbol.",
  })
  password: string;
}
