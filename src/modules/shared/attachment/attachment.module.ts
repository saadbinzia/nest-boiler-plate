import { Module } from "@nestjs/common";
import { AttachmentService } from "./attachment.service";
import { AttachmentsController } from "./attachments.controller";
import { HelperService } from "src/core/config/helper.service";
import GlobalResponses from "src/core/config/GlobalResponses";

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentService, HelperService, GlobalResponses],
  exports: [AttachmentService],
})
export class AttachmentModule {}
