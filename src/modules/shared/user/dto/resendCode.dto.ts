import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Resend Code DTO
 * @description This data transfer object is used to store the user's email.
 */
export class ResendCodeDTO {
  @ApiProperty({
    description: "User's email address to resend the verification code",
    example: "user@example.com",
    format: "email",
  })
  @IsNotEmpty({ message: `Email should not be empty!` })
  @IsEmail()
  readonly email: string;
}
