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
export class ResetPasswordDTO {
  @ValidateIf((o) => o.uuid === undefined)
  @IsNotEmpty({ message: "Code is required" })
  @IsString({ message: "Verification code should be a string." })
  readonly code: string;

  @ValidateIf((o) => o.code === undefined)
  @IsNotEmpty({ message: "UUID is required" })
  @IsString({ message: "Verification uuid should be a string." })
  readonly uuid: string;

  @IsNotEmpty({ message: "Password fields can't be empty." })
  @MinLength(8, { message: "Password should be at least 8 characters long." })
  @MaxLength(32, { message: "Password can't be more than 32 characters." })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,32}$/, {
    message:
      "Password must contain at least one number, one uppercase letter, and one symbol.",
  })
  password: string;
}
