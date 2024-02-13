import { Controller, Post, Req } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly _webhookService: WebhookService
  ) { }

  @Post('')
  async webhooks(@Req() req) {
    try {

      console.log(req);

    } catch (error) {

      console.error(error);

    }
  }
}