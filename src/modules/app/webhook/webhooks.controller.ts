import {
  Controller
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { WebhookService } from "./webhook.service";

@ApiTags("Webhooks")
@Controller("ebhooks")
export class WebhooksController {
  constructor(private readonly _webhookService: WebhookService) {}

}
