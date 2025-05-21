import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import { UserSessionService } from "./userSession/userSession.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class SharedAuthService {
  constructor(
    private readonly _jwtService: JwtService,
    @Inject(forwardRef(() => UserSessionService))
    private readonly _userSessionService: UserSessionService,
  ) {}

  /**
   * Generate token
   * @description Generate JWT token with user detail.
   * @param {any} user
   * @returns {Promise<string>}
   */
  async generateToken(user: any): Promise<string> {
    return await this._jwtService.signAsync(user, {
      secret: process.env.JWT_SECRET,
    });
  }

  /**
   * Compare password
   * @description Compare entered password and db password(encrypted) using bcrypt.
   * @param {String} enteredPassword
   * @param {String} passwordInDatabase
   * @returns {Promise<boolean>}
   */
  async comparePassword(
    enteredPassword: string,
    passwordInDatabase: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, passwordInDatabase);
  }

  /**
   * Creates a token for a user based on the provided request, user ID, user email, and remember me flag.
   *
   * @param {Request} req - The request object.
   * @param {number} userId - The ID of the user.
   * @param {string} userEmail - The email of the user.
   * @param {boolean} [rememberMe=false] - Optional. Indicates whether the token should be remembered for future sessions.
   * @return {Promise<string>} The generated token.
   */
  async createToken(
    req: Request,
    userId: number,
    userEmail: string,
    role: string,
    rememberMe: boolean = false,
    preferredLanguage: string = "en",
  ): Promise<string> {
    const token = await this.generateToken({
      id: userId,
      email: userEmail,
      role,
      preferredLanguage: preferredLanguage,
    });
    await this._userSessionService.createSession(req, {
      userId: userId,
      authToken: token,
      rememberMe: rememberMe,
      status: GlobalEnums.USER_SESSION_STATUS.ACTIVE,
      publicIp: req?.headers["origin"] ? req.headers["origin"] : "",
      browser: req?.headers["user-agent"]
        ? req.headers["user-agent"]
        : "Unknown Browser",
      operatingSystem: req?.headers["sec-ch-ua-platform"]
        ? req.headers["sec-ch-ua-platform"]
        : "",
    });

    return token;
  }
}
