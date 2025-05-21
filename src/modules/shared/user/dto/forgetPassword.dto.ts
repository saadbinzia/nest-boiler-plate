import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Forget password DTO (Data Transfer Object)
 * @description Forget password DTO is utilized to validate the forget password request data before invoking the controller function.
 * Used at the beginning of the process.
 */
export class ForgetPasswordDTO {
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail({}, { message: "Invalid email format" })
  readonly email: string;
}
