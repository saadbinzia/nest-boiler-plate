import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**
 * User DTO (Data Transfer Object)
 * @description User DTO is utilized to validate the user create/update request data before invoking the controller function.
 * Used at the beginning of the process.
 */
export class UpdateUserDTO {
  @ApiProperty({
    description: "First name (alphabets and spaces only)",
    example: "John",
    minLength: 1,
  })
  @IsNotEmpty({ message: "First name should not be empty" })
  readonly fullName: string;
}
