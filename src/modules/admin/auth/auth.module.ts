import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { AttachmentModule } from "src/modules/shared/attachment/attachment.module";
import { SharedAuthService } from "src/modules/shared/auth/auth.service";
import { UserSessionService } from "src/modules/shared/auth/userSession/userSession.service";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "jwt",
      property: "user",
      session: false,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AttachmentModule),
  ],
  controllers: [AuthController],
  providers: [
    SharedAuthService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GlobalResponses,
    HelperService,
    UserSessionService,
  ],
  exports: [AuthService, PassportModule, JwtModule, UserSessionService],
})
export class AuthModule {}
