import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Resend Code DTO
 * @description This data transfer object is used to store the user's email.
 */
export class ResendCodeDTO {
  @IsNotEmpty({ message: `Email should not be empty!` })
  @IsEmail()
  readonly email: string;
}
