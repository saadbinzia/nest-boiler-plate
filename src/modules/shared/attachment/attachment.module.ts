import { Module } from "@nestjs/common";
import { AttachmentService } from "./attachment.service";
import { AttachmentsController } from "./attachments.controller";
import { HelperService } from "src/core/config/helper.service";
import GlobalResponses from "src/core/config/GlobalResponses";
import { S3Service } from "../s3/s3.service";

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentService, HelperService, GlobalResponses, S3Service],
  exports: [AttachmentService, S3Service],
})
export class AttachmentModule {}
