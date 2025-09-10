import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  IsBoolean,
  IsDate,
} from "class-validator";
import { GlobalEnums, TSessionStatus } from "src/core/config/globalEnums";

const { SESSION_STATUS } = GlobalEnums;

/**
 * User session DTO (Data Transfer Object)
 * @description User session DTO is utilized to validate the create user session request data before invoking the controller function.
 * Used at the beginning of the process.
 */

export class UserSessionDTO {
  @IsNotEmpty({ message: "User id should not be empty" })
  readonly userId: number | string;

  @IsNotEmpty({ message: "Auth token should not be empty" })
  @IsString()
  readonly authToken: string;

  @IsNotEmpty({ message: "Status should not be empty" })
  @IsIn(Object.values(SESSION_STATUS), { message: "Invalid session status" })
  readonly status: TSessionStatus;

  @IsOptional()
  @IsBoolean()
  readonly rememberMe?: boolean;

  @IsOptional()
  @IsString()
  readonly browser?: string;

  @IsOptional()
  @IsString()
  readonly publicIp?: string;

  @IsOptional()
  @IsString()
  readonly operatingSystem?: string;

  @IsOptional()
  @IsString()
  readonly userAgent?: string;

  @IsOptional()
  @IsDate()
  readonly revokedAt?: Date;
}
