import { Controller, Post, Req } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Webhooks (Not configured yet)")
@Controller("Webhooks")
export class WebhooksController {
  constructor(private readonly _webhookService: WebhookService) {}

  @Post("")
  @ApiOperation({
    summary: "webhooks",
    description: "webhooks",
  })
  async webhooks(@Req() req) {
    try {
      console.log(req);
    } catch (error) {
      console.error(error);
    }
  }
}
