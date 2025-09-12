import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Verify reset password Code DTO (Data Transfer Object)
 * @description Verify reset password Code DTO is utilized to validate the verification reset password code request data before invoking the controller function.
 * Used at the beginning of the process.
 */
export class SharedVerifyResetPasswordCodeDTO {
  @ApiProperty({
    description: "The reset code sent to the user's email",
    example: "482915",
  })
  @IsNotEmpty({ message: "Reset code should not be empty" })
  readonly code: string;

  @ApiProperty({
    description: "User's email address",
    example: "user@example.com",
    format: "email",
  })
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail()
  readonly email: string;
}
