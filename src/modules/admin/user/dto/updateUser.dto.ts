import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

/**
 * User DTO (Data Transfer Object)
 * @description User DTO is utilized to validate the user create/update request data before invoking the controller function.
 * Used at the beginning of the process.
 */
export class AdminUpdateUserDTO {
  @ApiProperty({
    description: "First name (alphabets and spaces only)",
    example: "John",
    minLength: 1,
    pattern: "^[A-Za-z\\s]+$",
  })
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

  readonly phoneNumber?: string;
}
