import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { Attachment } from "src/entities";
import { v1 as uuidv1 } from "uuid";
import { GlobalEnums } from "src/core/config/globalEnums";
import { Request } from "express";
import { S3Service } from "../s3/s3.service";

const { RESPONSE_STATUSES } = GlobalEnums;
@Injectable()
export class AttachmentService extends BaseService<Attachment> {
  /**
   * Constructor for the Attachment Service.
   */
  constructor(
    private readonly _helperService: HelperService,
    private readonly _globalResponses: GlobalResponses,
    private readonly _s3Service: S3Service,
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
  ): Promise<
    | Attachment
    | { fileOriginalName: string; filePath: string; fileUniqueName: string }
  > {
    try {
      const splitAry = file.originalname.split(".");
      const ext = splitAry[splitAry.length - 1];
      const name = uuidv1() + "." + ext;
      const folder = `attachments/${parent}/${parentId}/${type}`;

      // Upload original file to S3
      await this._s3Service.uploadFile(
        name,
        file.buffer,
        file.mimetype,
        folder,
      );

      // Create resized versions and upload to S3
      const resized256Buffer = await this._helperService.resizeImageBuffer(
        file.buffer,
        256,
        256,
        60,
      );
      const resized512Buffer = await this._helperService.resizeImageBuffer(
        file.buffer,
        512,
        512,
        60,
      );

      await this._s3Service.uploadFile(
        `256x256_${name}`,
        resized256Buffer,
        file.mimetype,
        folder,
      );
      await this._s3Service.uploadFile(
        `512x512_${name}`,
        resized512Buffer,
        file.mimetype,
        folder,
      );

      const attachmentExist = await this.findOne(req, {
        parentId,
        parent,
        type,
      });

      if (attachmentExist) {
        const fields = {
          fileOriginalName: file.originalname,
          filePath: folder,
          fileUniqueName: name,
        };
        await this.update(req, { id: attachmentExist.id }, fields);
        if (attachmentExist.fileUniqueName) {
          try {
            // Delete previous files from S3
            await this._s3Service.deleteFile(
              attachmentExist.fileUniqueName,
              attachmentExist.filePath,
            );
            await this._s3Service.deleteFile(
              `256x256_${attachmentExist.fileUniqueName}`,
              attachmentExist.filePath,
            );
            await this._s3Service.deleteFile(
              `512x512_${attachmentExist.fileUniqueName}`,
              attachmentExist.filePath,
            );
          } catch (error) {
            console.error(error);
          }
        }
        return {
          fileOriginalName: file.originalname,
          filePath: folder,
          fileUniqueName: name,
        };
      } else {
        const fields = {
          parentId,
          parent,
          type,
          fileOriginalName: file.originalname,
          filePath: folder,
          fileUniqueName: name,
        };
        return await this.create(
          req,
          {
            ...fields,
            createdBy: req.user?.id || null,
            updatedBy: req.user?.id || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as any,
          { returning: true },
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
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
      const attachmentExist = await this.findOne(req, {
        parentId,
        parent,
        type,
      });
      if (attachmentExist) {
        await this.delete(req, { id: attachmentExist.id });
        if (attachmentExist.fileUniqueName) {
          try {
            // Delete files from S3
            await this._s3Service.deleteFile(
              attachmentExist.fileUniqueName,
              attachmentExist.filePath,
            );
            await this._s3Service.deleteFile(
              `256x256_${attachmentExist.fileUniqueName}`,
              attachmentExist.filePath,
            );
            await this._s3Service.deleteFile(
              `512x512_${attachmentExist.fileUniqueName}`,
              attachmentExist.filePath,
            );
          } catch (error) {
            console.error("Error deleting files from S3:", error);
          }
        }
      }
      return {
        status: RESPONSE_STATUSES.SUCCESS,
        message: "attachment_removed",
      };
    } catch (error) {
      console.error(error);
      throw error;
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
      const attachment = await this.findOne(
        req,
        { parentId, parent, type },
        { attributes: ["filePath", "fileUniqueName"] },
      );
      return attachment;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
