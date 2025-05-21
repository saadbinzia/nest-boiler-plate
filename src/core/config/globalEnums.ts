import { Injectable } from "@nestjs/common";

/**
 * GlobalEnums
 *
 * @description need to put all global enums - things that we are going to use through out the app like user session response
 */
@Injectable()
export class GlobalEnums {
  /**
   * @description Statuses for user tokens in user sessions table.
   */
  static readonly USER_SESSION_STATUS = {
    EXPIRED: "EXPIRED",
    ACTIVE: "ACTIVE",
  };

  /**
   * @description Possible status that we can send in response
   */
  static readonly RESPONSE_STATUSES = {
    SUCCESS: "success",
    ERROR: "error",
    RESTRICTION: "restriction",
    UN_VERIFIED_USER: "unVerifiedUser",
  };

  /**
   * Static registration statuses for the registration process.
   * Represents the different stages a user goes through during registration.
   */
  static readonly REGISTRATION_STATUSES = {
    /**
     * Registration has started.
     * User has initiated the registration process.
     */
    REGISTRATION_STARTED: 10,

    /**
     * User has been verified.
     * Verification process for the user is complete.
     */
    USER_VERIFIED: 20,

    /**
     * Registration has been completed.
     * User has successfully completed the registration process.
     */
    REGISTRATION_COMPLETED: 30,
  };

  /**
   * Static registration statuses for the registration process.
   * Represents the different stages a user goes through during registration.
   */
  static readonly ACTIVE_STATUSES = {
    /**
     * user is active.
     */
    ACTIVE: 10,

    /**
     * User is inactive.
     */
    IN_ACTIVE: 20,
  };

  static readonly USER_ROLES = {
    SUPER_ADMIN: "admin",
    USER: "user",
  };

  /**
   * Language Enum
   */
  static readonly LANGUAGES = {
    EN: "en",
    ES: "es",
  };

  /**
   * Transaction Status Enum
   */
  static readonly TRANSACTION_STATUSES = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed",
    DISPUTED: "Disputed",
    CANCELED: "Canceled",
  };

  static readonly SYSTEM_SETTING_KEYS = {
    VERIFICATION_CODE_EXPIRY: "verificationCodeExpiry",
  };
}
