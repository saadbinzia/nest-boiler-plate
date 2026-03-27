import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { User } from "src/entities";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { Request } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { ApiResponse } from "src/core/config/interface/globalResponses.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";

const {
  RESPONSE_STATUSES,
  ACTIVE_STATUSES,
  REGISTRATION_STATUSES,
  USER_ROLES,
} = GlobalEnums;

/**
 * User Service
 * @description Handles all user-related business logic
 */
@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly _globalResponses: GlobalResponses) {
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

  /**
   * Create user
   * @description Create new user record for client registration.
   * @param {Request} req
   * @param {CreateUserDto} payload
   * @return {Promise<ApiResponse>}
   */
  async createUser(req: Request, payload: CreateUserDto): Promise<ApiResponse> {
    const userExists = await this.findByEmail(req, payload.email);

    // Check if user exists against this email then notify user.
    if (userExists) {
      const error = new Error("email_already_exists");
      error.name = "ConflictError";
      throw error;
    }

    let hashPass = null;

    if (payload.password) {
      hashPass = await bcrypt.hash(payload.password, 10);
    }

    // Always set role to USER for client signups (security: prevent role escalation)
    const userPayload = {
      email: payload.email.toLowerCase(),
      fullName: payload.fullName,
      password: hashPass,
      role: USER_ROLES.USER,
      status: ACTIVE_STATUSES.ACTIVE,
      registrationStatus: REGISTRATION_STATUSES.UNVERIFIED,
    };

    const userData = plainToInstance(User, userPayload);

    const newUser = await this.create(req, userData);

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    const result = { ...newUser["dataValues"] };

    delete result.password; // Remove the 'password' property

    return this._globalResponses.formatResponse(
      req,
      RESPONSE_STATUSES.SUCCESS,
      result,
      "user_created",
    );
  }
}
