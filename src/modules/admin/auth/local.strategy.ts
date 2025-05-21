import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super({ usernameField: "email" });
  }

  /**
   * Validate
   * @description Used to valid user credentials.
   * @param {Object}payload
   * @returns {Promise<JSON>}
   */
  async validate(payload: any): Promise<object> {
    const user = await this._authService.validateUser(payload);
    return user;
  }
}
