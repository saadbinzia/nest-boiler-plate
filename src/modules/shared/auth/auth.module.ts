import { Module } from "@nestjs/common";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { SharedAuthService } from "src/modules/shared/auth/auth.service";
import { UserSessionService } from "src/modules/shared/auth/userSession/userSession.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    SharedAuthService,
    GlobalResponses,
    HelperService,
    UserSessionService,
  ],
  exports: [UserSessionService],
})
export class AuthModule {}
