import { Module } from "@nestjs/common";
import { HelperService } from "src/core/config/helper.service";
import { WebhookService } from "./webhook.service";
import { WebhooksController } from "./webhooks.controller";

@Module({
  imports: [],
  controllers: [WebhooksController],
  providers: [WebhookService, HelperService],
  exports: [WebhookService],
})
export class WebhookModule {}
