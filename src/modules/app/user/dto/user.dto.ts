import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
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
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: "First name should not be empty" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "First name should contain only alphabets and spaces",
  })
  readonly firstName: string;

  @IsNotEmpty({ message: "Last name should not be empty" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Last name should contain only alphabets and spaces",
  })
  readonly lastName: string;

  @IsNotEmpty({ message: "Phone Number should not be empty" })
  readonly phoneNumber: string;

  @MinLength(8, { message: "Password should be at least 8 characters long." })
  @MaxLength(32, { message: "Password can't be more than 32 characters." })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,32}$/, {
    message:
      "Password must contain at least one number, one uppercase letter, and one symbol.",
  })
  readonly password?: string;

  @IsNotEmpty({ message: "Keep user updated field should not be empty" })
  readonly keepUserUpdated: boolean;

  @IsNotEmpty({
    message: "Agree to terms and conditions field should not be empty",
  })
  @IsBoolean({ message: "Agree to terms and conditions must be a boolean" })
  @Equals(true, {
    message: "You must agree to the terms and conditions",
  })
  readonly agreeTermsAndConditions: boolean;

  @IsOptional()
  readonly referralUser: string;

  @IsOptional()
  readonly preferredLanguage: string;
}
