import { Module } from "@nestjs/common";
import { HelperService } from "src/core/config/helper.service";
import { WebhookService } from "./webhook.service";
import { WebhooksController } from "./webhooks.controller";
import GlobalResponses from "src/core/config/GlobalResponses";

@Module({
  imports: [],
  controllers: [WebhooksController],
  providers: [
    WebhookService,
    HelperService,
    GlobalResponses,
  ],
  exports: [WebhookService],
})
export class WebhookModule {}
