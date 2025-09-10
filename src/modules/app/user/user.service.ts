import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { User } from "src/entities";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { Request } from "express";

/**
 * User Service
 * @description Handles all user-related business logic
 */
@Injectable()
export class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  /**
   * Find user by email
   * @param {string} email - The email to search for
   * @returns {Promise<User | null>} Promise resolving to the user or null if not found
   */
  async findByEmail(
    req: Request | AuthenticatedRequest,
    email: string,
  ): Promise<User | null> {
    return this.findOne(req, { email: email.toLowerCase() });
  }

  // /**
  //  * Create a new user
  //  * @param {CreateUserDto} createUserDto - User data transfer object
  //  * @returns {Promise<User>} The created user
  //  * @throws {Error} If user creation fails or validation error occurs
  //  */
  // async createNewUser(
  //   req: Request | AuthenticatedRequest,
  //   createUserDto: CreateUserDto,
  // ): Promise<User> {
  //   try {
  //     // Check if user with email already exists
  //     const userExists = await this.findByEmail(req, createUserDto.email);
  //     if (
  //       userExists &&
  //       userExists.registrationStatus !== REGISTRATION_STATUSES.PENDING
  //     ) {
  //       const error = new Error("email_already_exists");
  //       error.name = "ConflictError";
  //       throw error;
  //     }

  //     // Hash password
  //     const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  //     if (
  //       userExists &&
  //       userExists.registrationStatus === REGISTRATION_STATUSES.PENDING
  //     ) {
  //       // Update existing pending user
  //       const [updatedCount, [updatedUser]] = await this.update(
  //         req,
  //         { id: userExists.id },
  //         {
  //           ...createUserDto,
  //           email: createUserDto?.email?.toLowerCase(),
  //           password: hashedPassword,
  //           role: USER_ROLES.USER,
  //           status: ACTIVE_STATUSES.ACTIVE,
  //           registrationStatus: REGISTRATION_STATUSES.PENDING,
  //         } as any,
  //       );

  //       if (!updatedCount) {
  //         throw new Error("Failed to update pending user");
  //       }

  //       // Clear password from the returned user object
  //       const userJson = updatedUser.get({ plain: true });
  //       delete userJson.password;

  //       await this._userVerificationCodeService.createVerificationCodeByEmail(
  //         req,
  //         userJson.email,
  //         VERIFICATION_CODE_TYPE.REGISTRATION,
  //       );
  //       return userJson as User;
  //     } else {
  //       // Create user
  //       const newUser = await this.create(req, {
  //         ...createUserDto,
  //         email: createUserDto?.email?.toLowerCase(),
  //         password: hashedPassword,
  //         role: USER_ROLES.USER,
  //         status: ACTIVE_STATUSES.ACTIVE,
  //         registrationStatus: REGISTRATION_STATUSES.PENDING,
  //       } as any);

  //       if (!newUser) {
  //         throw new Error("Failed to create user");
  //       }

  //       // Clear password from the returned user object
  //       const userJson = newUser.get({ plain: true });
  //       delete userJson.password;

  //       await this._userVerificationCodeService.createVerificationCodeByEmail(
  //         req,
  //         userJson.email?.toLowerCase(),
  //         VERIFICATION_CODE_TYPE.REGISTRATION,
  //       );
  //       return userJson as User;
  //     }
  //   } catch (error) {
  //     // Re-throw the error with a name that can be checked in the controller
  //     if (
  //       error.name === "SequelizeValidationError" ||
  //       error.name === "SequelizeUniqueConstraintError"
  //     ) {
  //       error.name = "ValidationError";
  //     }
  //     throw error;
  //   }
  // }
}
