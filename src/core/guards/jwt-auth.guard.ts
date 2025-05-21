import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GlobalEnums } from "src/core/config/globalEnums";
import { HelperService } from "src/core/config/helper.service";
import { CacheService } from "src/modules/shared/cache/cache.service";
import { UserSessionService } from "src/modules/shared/auth/userSession/userSession.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private _cacheService: CacheService,
    private readonly _jwtService: JwtService,
    private readonly _userSession: UserSessionService,
    private readonly _helperService: HelperService,
  ) {}

  /**
   * Can activate
   * @description Validate each request that its valid or not.
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this._helperService.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this._jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Verify session (active OR expired)
      const sessionResult = await this.verifySession(token);

      if (sessionResult) {
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request["user"] = payload;
      } else {
        throw { data: "sessionExpired" };
      }
    } catch (error) {
      console.error(error);
      if (error && error.data === "sessionExpired") {
        throw new HttpException("Session is expired", 401);
      } else {
        throw new UnauthorizedException();
      }
    }
    return true;
  }

  /**
   * Verify session
   * @description Check that user is active or expired
   * @param {String} token
   * @returns {Promise<boolean>}
   */
  private async verifySession(token: string): Promise<boolean> {
    const cashedUserJson = await this._cacheService.getSession(token);

    if (
      cashedUserJson &&
      cashedUserJson.status === GlobalEnums.USER_SESSION_STATUS.ACTIVE
    ) {
      if (cashedUserJson.rememberMe) {
        return true;
      } else {
        if (
          !!cashedUserJson.lastSyncTime &&
          cashedUserJson.lastSyncTime + 24 * 60 * 60 * 1000 > Number(Date.now())
        ) {
          await this._cacheService.setSession(
            cashedUserJson.authToken,
            cashedUserJson,
          );

          return true;
        } else {
          return false;
        }
      }
    } else {
      const session: any = await this._userSession.findSession(token);

      if (
        session?.dataValues.status &&
        session.dataValues.status === GlobalEnums.USER_SESSION_STATUS.ACTIVE
      ) {
        // Update Cache

        if (
          session.dataValues.rememberMe ||
          Number(new Date(session.dataValues.createdAt)) + 24 * 60 * 60 * 1000 >
            Number(Date.now())
        ) {
          await this._cacheService.setSession(token, session.dataValues);

          return true;
        } else {
          return false;
        }
      }
    }

    return false;
  }
}
