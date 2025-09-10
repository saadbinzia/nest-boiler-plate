import { IsNotEmpty, IsOptional, Matches } from "class-validator";

/**
 * User DTO (Data Transfer Object)
 * @description User DTO is utilized to validate the user create/update request data before invoking the controller function.
 * Used at the beginning of the process.
 */
export class UpdateUserDTO {
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

  @IsOptional()
  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, {
    message: "Invalid phone number format",
  })
  readonly phoneNumber?: string;
}
