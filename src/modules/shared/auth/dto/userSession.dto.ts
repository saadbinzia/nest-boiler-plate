import { IsNotEmpty } from "class-validator";

/**
 * User session DTO (Data Transfer Object)
 * @description User session DTO is utilized to validate the create user session request data before invoking the controller function.
 * Used at the beginning of the process.
 */
export class UserSessionDTO {
  @IsNotEmpty({ message: "User id should not be empty" })
  readonly userId: number | string;

  @IsNotEmpty({ message: "Auth token should not be empty" })
  readonly authToken: string;

  @IsNotEmpty({ message: "Status should not be empty" })
  readonly status: string;

  readonly rememberMe: boolean;

  readonly browser: string | string[];

  readonly publicIp: string;

  readonly operatingSystem: string | string[];
}
