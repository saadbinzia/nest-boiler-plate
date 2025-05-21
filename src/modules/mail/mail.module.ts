import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { ConfigModule } from "@nestjs/config";
import GlobalResponses from "src/core/config/GlobalResponses";

@Module({
  imports: [ConfigModule],
  providers: [MailService, GlobalResponses],
  exports: [MailService],
})
export class MailModule {}
