import { Module } from "@nestjs/common";
import { AttachmentService } from "./attachment.service";
import { AttachmentsController } from "./attachments.controller";
import { HelperService } from "src/core/config/helper.service";
import GlobalResponses from "src/core/config/GlobalResponses";
import { attachmentStorageProvider } from "./attachment-storage.provider";

@Module({
  controllers: [AttachmentsController],
  providers: [
    attachmentStorageProvider,
    AttachmentService,
    HelperService,
    GlobalResponses,
  ],
  exports: [AttachmentService],
})
export class AttachmentModule {}
