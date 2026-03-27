import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

/**
 * User DTO (Data Transfer Object)
 * @description User DTO is utilized to validate the user create/update request data before invoking the controller function.
 * Used at the beginning of the process.
 */
export class UserDTO {
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: "First name should not be empty" })
  readonly fullName: string;

  @MinLength(8, { message: "Password should be at least 8 characters long." })
  @MaxLength(32, { message: "Password can't be more than 32 characters." })
  readonly password?: string;
}
