import { Controller } from "@nestjs/common";
import { AttachmentService } from "./attachment.service";

@Controller("attachments")
export class AttachmentsController {
  constructor(private readonly _AttachmentService: AttachmentService) {}
}
