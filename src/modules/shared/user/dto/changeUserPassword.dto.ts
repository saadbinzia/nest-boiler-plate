import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

/**
 * Change User Password DTO (Data Transfer Object)
 */
export class ChangeUserPasswordDTO {
  @IsNotEmpty({ message: "Old password should not be empty" })
  readonly oldPassword: string;

  @IsNotEmpty({ message: "New password should not be empty" })
  @MinLength(8, { message: "Password should be at least 8 characters long." })
  @MaxLength(32, { message: "Password can't be more than 32 characters." })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,32}$/, {
    message:
      "Password must contain at least one number, one uppercase letter, and one symbol.",
  })
  readonly newPassword: string;
}
