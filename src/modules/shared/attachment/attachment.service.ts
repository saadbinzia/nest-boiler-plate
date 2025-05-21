import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { Attachment } from "src/entities";
import { v1 as uuidv1 } from "uuid";
import { GlobalEnums } from "src/core/config/globalEnums";
import { Request } from "express";

@Injectable()
export class AttachmentService extends BaseService {
  /**
   * Constructor for the Attachment Service.
   */
  constructor(
    private readonly _helperService: HelperService,
    private readonly _globalResponses: GlobalResponses,
  ) {
    super(Attachment);
  }

  /**
   * Adds an attachment to the specified parent with the given file.
   *
   * @description The flow for this function is as follows:
   * 		- It will create 3 variants of attachment (256x256, 512x512, original).
   * 		- It will check for the existence of the parent attachment.
   * 		- If the attachment is already there so it will update the attachment and delete the previous attachment.
   * 		- If the attachment is not there so it will create a new attachment.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {number} parentId - The ID of the parent.
   * @param {string} parent - The type of the parent.
   * @param {string} type - The type of the attachment.
   * @param {Express.Multer.File} file - The file to be attached.
   * @return {Promise<object>} A promise that resolves to the attached attachment object.
   *
   * @throws {Error} If there is an error while attaching the attachment.
   */
  async addImageAttachment(
    req: AuthenticatedRequest,
    parentId: number,
    parent: string,
    type: string,
    file: Express.Multer.File,
  ): Promise<object> {
    try {
      const path = `uploads/${parent}/${parentId}/${type}`;
      await this._helperService.createDirectory(path);

      const splitAry = file.originalname.split(".");
      const ext = splitAry[splitAry.length - 1];
      const name = uuidv1() + "." + ext;

      await this._helperService.CreateFile(
        `./${path}/${name}`,
        file.buffer,
        "binary",
      );
      await this._helperService.resizeImage(
        `./${path}/${name}`,
        256,
        256,
        60,
        true,
      );
      await this._helperService.resizeImage(
        `./${path}/${name}`,
        512,
        512,
        60,
        true,
      );

      const attachmentExist = await this.findOne({ parentId, parent, type });

      if (attachmentExist) {
        const fields = {
          fileOriginalName: file.originalname,
          filePath: path,
          fileUniqueName: name,
        };
        await this.updateById(attachmentExist.id, fields);
        if (attachmentExist.fileUniqueName) {
          try {
            await this._helperService.deleteFile(
              `./${path}/${attachmentExist.fileUniqueName}`,
            );
            await this._helperService.deleteFile(
              `./${path}/256x256_${attachmentExist.fileUniqueName}`,
            );
            await this._helperService.deleteFile(
              `./${path}/512x512_${attachmentExist.fileUniqueName}`,
            );
          } catch (error) {
            console.error(error);
          }
        }
        return {};
      } else {
        const fields = {
          parentId,
          parent,
          type,
          fileOriginalName: file.originalname,
          filePath: path,
          fileUniqueName: name,
        };
        return await this.create(fields);
      }
    } catch (error) {
      console.error(error);
      throw this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "attachment_not_created",
      );
    }
  }

  /**
   * Remove an attachment against the specified parent.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {number} parentId - The ID of the parent.
   * @param {string} parent - The type of the parent.
   * @param {string} type - The type of the attachment.
   * @return {Promise<object>} A promise that resolves to the attached attachment object.
   *
   * @throws {Error} If there is an error while attaching the attachment.
   */
  async removeAttachment(
    req: AuthenticatedRequest,
    parentId: number,
    parent: string,
    type: string,
  ): Promise<object> {
    try {
      const attachmentExist = await this.findOne({ parentId, parent, type });
      if (attachmentExist) {
        await this.deleteById(attachmentExist.id);
        if (attachmentExist.fileUniqueName) {
          await this._helperService.deleteFile(
            `./${attachmentExist.filePath}${attachmentExist.fileUniqueName}`,
          );
          await this._helperService.deleteFile(
            `./${attachmentExist.filePath}256x256_${attachmentExist.fileUniqueName}`,
          );
          await this._helperService.deleteFile(
            `./${attachmentExist.filePath}512x512_${attachmentExist.fileUniqueName}`,
          );
        }
      }
      return this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.SUCCESS,
        null,
        "attachment_removed",
      );
    } catch (error) {
      console.error(error);
      throw this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        "attachment_not_deleted",
      );
    }
  }

  /**
   * Find an attachment against the specified parent.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {number} parentId - The ID of the parent.
   * @param {string} parent - The type of the parent.
   * @param {string} type - The type of the attachment.
   * @return {Promise<object>} A promise that resolves to the attached attachment object.
   *
   * @throws {Error} If there is an error while attaching the attachment.
   */

  async findAttachment(
    req: AuthenticatedRequest | Request,
    parentId: number,
    parent: string,
    type: string,
  ): Promise<object> {
    try {
      const attachment = await this.findOne({ parentId, parent, type }, null, [
        "filePath",
        "fileUniqueName",
      ]);
      return attachment;
    } catch (error) {
      console.error(error);
      throw this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        error,
        "attachment_not_found",
      );
    }
  }
}
