import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import GlobalResponses from "src/core/config/GlobalResponses";
import { HelperService } from "src/core/config/helper.service";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import { Attachment } from "src/entities";
import { v1 as uuidv1 } from "uuid";
import { GlobalEnums } from "src/core/config/globalEnums";
import { Request } from "express";
import { S3Service } from "../s3/s3.service";
import { GCSService } from "../gcs/gcs.service";
import { ATTACHMENT_STORAGE } from "./attachment-storage.provider";

const { RESPONSE_STATUSES } = GlobalEnums;
@Injectable()
export class AttachmentService extends BaseService<Attachment> {
  /**
   * Constructor for the Attachment Service.
   */
  constructor(
    private readonly _helperService: HelperService,
    private readonly _globalResponses: GlobalResponses,
    @Inject(ATTACHMENT_STORAGE)
    private readonly _storageService: S3Service | GCSService,
  ) {
    super(Attachment);
  }

  /**
   * Adds an attachment to the specified parent with the given file.
   *
   * @description The flow for this function is as follows:
   * 		- It will create 3 variants of attachment (256x256, 512x512, original).
   * 		- If replaceExisting is true, it will check for existing attachments and replace them.
   * 		- If replaceExisting is false, it will always create a new attachment.
   * 		- When replacing, it will delete the previous files from GCS.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {number} parentId - The ID of the parent.
   * @param {string} parent - The type of the parent.
   * @param {string} type - The type of the attachment.
   * @param {Express.Multer.File} file - The file to be attached.
   * @param {boolean} replaceExisting - Whether to replace existing attachment or add new one (default: false).
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
    replaceExisting: boolean = false,
  ): Promise<
    | Attachment
    | { fileOriginalName: string; filePath: string; fileUniqueName: string }
  > {
    try {
      const splitAry = file.originalname.split(".");
      const ext = splitAry[splitAry.length - 1];
      const name = uuidv1() + "." + ext;
      const folder = `attachments/${parent}/${parentId}/${type}`;

      console.log(
        `Starting image upload process for: ${file.originalname} (${file.size} bytes)`,
      );

      // Upload original file to GCS
      try {
        console.log(`Uploading original file: ${name}`);
        await this._storageService.uploadFile(
          name,
          file.buffer,
          file.mimetype,
          folder,
        );
        console.log(`Original file uploaded successfully: ${name}`);
      } catch (error) {
        console.error(`Failed to upload original file: ${error.message}`);
        throw new Error(`Original file upload failed: ${error.message}`);
      }

      // Create resized versions in parallel for better performance
      console.log(`Creating resized versions in parallel...`);
      const [resized256Buffer, resized512Buffer] = await Promise.all([
        this._helperService.resizeImageBuffer(file.buffer, 256, 256, 60),
        this._helperService.resizeImageBuffer(file.buffer, 512, 512, 60),
      ]);
      console.log(
        `Resized versions created - 256x256: ${resized256Buffer.length} bytes, 512x512: ${resized512Buffer.length} bytes`,
      );

      // Upload resized versions in parallel
      console.log(`Uploading resized versions in parallel...`);
      await Promise.all([
        this._storageService.uploadFile(
          `256x256_${name}`,
          resized256Buffer,
          file.mimetype,
          folder,
        ),
        this._storageService.uploadFile(
          `512x512_${name}`,
          resized512Buffer,
          file.mimetype,
          folder,
        ),
      ]);
      console.log(`All resized versions uploaded successfully`);

      // Check if we should replace existing image or add new one
      if (replaceExisting) {
        // For users/admin: Replace existing image (single image behavior)
        // Find ALL existing attachments for this parent/type combination
        const existingAttachments = await this.findAll(req, {
          parentId,
          parent,
          type,
        });

        // Delete all existing attachments and their files from GCS
        if (existingAttachments && existingAttachments.length > 0) {
          console.log(
            `Found ${existingAttachments.length} existing attachment(s) for ${parent}/${parentId}/${type}. Deleting all...`,
          );

          for (const attachment of existingAttachments) {
            // Delete files from GCS
            if (attachment.fileUniqueName) {
              try {
                await this._storageService.deleteFile(
                  `${attachment.filePath}/${attachment.fileUniqueName}`,
                );
                await this._storageService.deleteFile(
                  `${attachment.filePath}/256x256_${attachment.fileUniqueName}`,
                );
                await this._storageService.deleteFile(
                  `${attachment.filePath}/512x512_${attachment.fileUniqueName}`,
                );
                console.log(
                  `Deleted old files for attachment ID ${attachment.id}`,
                );
              } catch (error) {
                console.error(
                  `Error deleting files for attachment ID ${attachment.id}:`,
                  error.message,
                );
                // Continue even if deletion fails
              }
            }

            // Delete the attachment record from database
            await this.delete(req, { id: attachment.id });
          }

          console.log(
            `All existing attachments deleted. Creating new attachment...`,
          );
        }

        // Create new attachment record (ensures only one exists)
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
      } else {
        // For buildings/floors/spaces: Always create new attachment (multiple images support)
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
            // Clean up the file path to avoid double slashes
            let cleanFilePath = attachmentExist.filePath.trim();
            if (cleanFilePath.startsWith("/")) {
              cleanFilePath = cleanFilePath.slice(1);
            }

            // Delete files from GCS
            await this._storageService.deleteFile(
              `${cleanFilePath}/${attachmentExist.fileUniqueName}`,
            );
            await this._storageService.deleteFile(
              `${cleanFilePath}/256x256_${attachmentExist.fileUniqueName}`,
            );
            await this._storageService.deleteFile(
              `${cleanFilePath}/512x512_${attachmentExist.fileUniqueName}`,
            );
          } catch (error) {
            console.error("Error deleting files from GCS:", error);
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

  /**
   * This function will attach a document file to a specific entity.
   * This is a generic function that can handle any type of document upload.
   * For images, it reuses the existing addImageAttachment function.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {number} parentId - The ID of the parent entity.
   * @param {string} parent - The type of the parent entity.
   * @param {string} type - The type of attachment.
   * @param {Express.Multer.File} file - The file to be attached.
   * @param {boolean} replaceExisting - Whether to replace existing attachment or add new one (default: false).
   * @return {Promise<Attachment>} A promise that resolves to the attached attachment object.
   *
   * @throws {Error} If there is an error while attaching the attachment.
   */
  async addDocumentAttachment(
    req: AuthenticatedRequest,
    parentId: number,
    parent: string,
    type: string,
    file: Express.Multer.File,
    replaceExisting: boolean = false,
  ): Promise<Attachment> {
    try {
      // Validate file input
      if (!file || !file.buffer || file.buffer.length === 0) {
        throw new Error("Invalid file: buffer is empty or missing");
      }

      console.log(
        `Starting document upload process for: ${file.originalname} (${file.size} bytes)`,
      );
      console.log(`File buffer length: ${file.buffer.length} bytes`);
      console.log(`File MIME type: ${file.mimetype}`);

      // For images, use the existing addImageAttachment function
      if (file.mimetype.startsWith("image/")) {
        console.log(
          `Image document detected, using addImageAttachment function`,
        );
        const result = await this.addImageAttachment(
          req,
          parentId,
          parent,
          type,
          file,
          replaceExisting,
        );
        // If addImageAttachment returns a simple object, we need to create a proper Attachment
        if (
          typeof result === "object" &&
          "fileOriginalName" in result &&
          !("id" in result)
        ) {
          // This is the case where a single image entity was updated, return the existing attachment
          const existingAttachment = await this.findOne(req, {
            parentId,
            parent,
            type,
          });
          if (existingAttachment) {
            return existingAttachment;
          }
        }
        return result as Attachment;
      }

      // For non-image documents, handle them directly
      const splitAry = file.originalname.split(".");
      const ext = splitAry[splitAry.length - 1];
      const name = uuidv1() + "." + ext;
      const folder = `attachments/${parent}/${parentId}/${type}`;

      // Upload original file to GCS
      try {
        console.log(`Uploading original document: ${name}`);
        await this._storageService.uploadFile(
          name,
          file.buffer,
          file.mimetype,
          folder,
        );
        console.log(`Original document uploaded successfully: ${name}`);
      } catch (error) {
        console.error(`Failed to upload original document: ${error.message}`);
        throw new Error(`Original document upload failed: ${error.message}`);
      }

      // Create attachment record
      const attachment = await this.create(
        req,
        {
          parentId,
          parent,
          type,
          fileOriginalName: file.originalname,
          filePath: folder,
          fileUniqueName: name,
          createdBy: req.user?.id || null,
          updatedBy: req.user?.id || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
        { returning: true },
      );

      console.log(
        `Document attachment created successfully with ID: ${attachment.id}`,
      );
      return attachment;
    } catch (error) {
      console.error(`Error in addDocumentAttachment: ${error.message}`);
      throw error;
    }
  }

  /**
   * This function will attach multiple document files to a specific entity.
   * This is useful for bulk document uploads.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {number} parentId - The ID of the parent entity.
   * @param {string} parent - The type of the parent entity.
   * @param {string} type - The type of attachment.
   * @param {Express.Multer.File[]} files - The files to be attached.
   * @return {Promise<Attachment[]>} A promise that resolves to an array of attached attachment objects.
   *
   * @throws {Error} If there is an error while attaching the attachments.
   */
  async addMultipleDocumentAttachments(
    req: AuthenticatedRequest,
    parentId: number,
    parent: string,
    type: string,
    files: Express.Multer.File[],
  ): Promise<Attachment[]> {
    try {
      // Validate files input
      if (!files || files.length === 0) {
        throw new Error("No files provided");
      }

      console.log(
        `Starting bulk document upload process for ${files.length} files`,
      );

      // Process files in parallel for better performance
      const uploadPromises = files.map(async (file, index) => {
        try {
          console.log(
            `Processing file ${index + 1}/${files.length}: ${file.originalname}`,
          );
          return await this.addDocumentAttachment(
            req,
            parentId,
            parent,
            type,
            file,
          );
        } catch (error) {
          console.error(
            `Failed to upload file ${file.originalname}: ${error.message}`,
          );
          throw new Error(
            `Failed to upload file ${file.originalname}: ${error.message}`,
          );
        }
      });

      // Wait for all uploads to complete
      const attachments = await Promise.all(uploadPromises);

      console.log(`Successfully uploaded ${attachments.length} documents`);
      return attachments;
    } catch (error) {
      console.error(
        `Error in addMultipleDocumentAttachments: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * This function will attach multiple image files to a specific entity.
   * This is useful for bulk image uploads with proper resizing.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {number} parentId - The ID of the parent entity.
   * @param {string} parent - The type of the parent entity.
   * @param {string} type - The type of attachment.
   * @param {Express.Multer.File[]} files - The image files to be attached.
   * @return {Promise<Attachment[]>} A promise that resolves to an array of attached attachment objects.
   *
   * @throws {Error} If there is an error while attaching the attachments.
   */
  async addMultipleImageAttachments(
    req: AuthenticatedRequest,
    parentId: number,
    parent: string,
    type: string,
    files: Express.Multer.File[],
  ): Promise<Attachment[]> {
    try {
      // Validate files input
      if (!files || files.length === 0) {
        throw new Error("No files provided");
      }

      // Validate that all files are images
      const invalidFiles = files.filter(
        (file) => !file.mimetype.startsWith("image/"),
      );
      if (invalidFiles.length > 0) {
        throw new Error(
          `Invalid file types detected. Only image files are allowed. Invalid files: ${invalidFiles.map((f) => f.originalname).join(", ")}`,
        );
      }

      console.log(
        `Starting bulk image upload process for ${files.length} images`,
      );

      // Process files in parallel for better performance
      const uploadPromises = files.map(async (file, index) => {
        try {
          console.log(
            `Processing image ${index + 1}/${files.length}: ${file.originalname}`,
          );
          const result = await this.addImageAttachment(
            req,
            parentId,
            parent,
            type,
            file,
            false,
          );
          // If addImageAttachment returns a simple object, we need to create a proper Attachment
          if (
            typeof result === "object" &&
            "fileOriginalName" in result &&
            !("id" in result)
          ) {
            // This is the case where a single image entity was updated, return the existing attachment
            const existingAttachment = await this.findOne(req, {
              parentId,
              parent,
              type,
            });
            if (existingAttachment) {
              return existingAttachment;
            }
          }
          return result as Attachment;
        } catch (error) {
          console.error(
            `Failed to upload image ${file.originalname}: ${error.message}`,
          );
          throw new Error(
            `Failed to upload image ${file.originalname}: ${error.message}`,
          );
        }
      });

      // Wait for all uploads to complete
      const attachments = await Promise.all(uploadPromises);

      console.log(`Successfully uploaded ${attachments.length} images`);
      return attachments;
    } catch (error) {
      console.error(`Error in addMultipleImageAttachments: ${error.message}`);
      throw error;
    }
  }

  /**
   * This function will delete a document attachment and its associated files from GCS.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {number} attachmentId - The ID of the attachment to delete.
   * @return {Promise<boolean>} A promise that resolves to true if deletion was successful.
   *
   * @throws {Error} If there is an error while deleting the attachment.
   */
  async deleteDocumentAttachment(
    req: AuthenticatedRequest,
    attachmentId: number,
  ): Promise<boolean> {
    try {
      // Find the attachment first
      const attachment = await this.findOne(req, { id: attachmentId });

      if (!attachment) {
        throw new Error("Attachment not found");
      }

      console.log(
        `Deleting document attachment: ${attachment.fileOriginalName} (ID: ${attachmentId})`,
      );

      // Delete files from GCS
      try {
        // Delete original file
        if (attachment.fileUniqueName) {
          await this._storageService.deleteFile(
            `${attachment.filePath}/${attachment.fileUniqueName}`,
          );
          console.log(`Deleted original file: ${attachment.fileUniqueName}`);

          // Delete resized versions if they exist (only for images)
          const isImageFile = attachment.fileUniqueName.match(
            /\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i,
          );
          if (isImageFile) {
            try {
              await this._storageService.deleteFile(
                `${attachment.filePath}/256x256_${attachment.fileUniqueName}`,
              );
              console.log(
                `Deleted 256x256 version: 256x256_${attachment.fileUniqueName}`,
              );
            } catch {
              console.log(`256x256 version not found or already deleted`);
            }

            try {
              await this._storageService.deleteFile(
                `${attachment.filePath}/512x512_${attachment.fileUniqueName}`,
              );
              console.log(
                `Deleted 512x512 version: 512x512_${attachment.fileUniqueName}`,
              );
            } catch {
              console.log(`512x512 version not found or already deleted`);
            }
          } else {
            console.log(
              `Skipping resized version deletion for non-image file: ${attachment.fileUniqueName}`,
            );
          }
        }
      } catch (error) {
        console.error(`Error deleting files from GCS: ${error.message}`);
        // Continue with database deletion even if GCS deletion fails
      }

      // Delete the attachment record from database
      await this.delete(req, { id: attachmentId });

      console.log(
        `Document attachment deleted successfully (ID: ${attachmentId})`,
      );
      return true;
    } catch (error) {
      console.error(`Error in deleteDocumentAttachment: ${error.message}`);
      throw error;
    }
  }

  /**
   * This function will delete multiple document attachments and their associated files from GCS.
   *
   * @param {AuthenticatedRequest} req - The authenticated request object.
   * @param {number[]} attachmentIds - The IDs of the attachments to delete.
   * @return {Promise<{successful: number, failed: number, errors: string[]}>} A promise that resolves to deletion results.
   *
   * @throws {Error} If there is an error while deleting the attachments.
   */
  async deleteMultipleDocumentAttachments(
    req: AuthenticatedRequest,
    attachmentIds: number[],
  ): Promise<{ successful: number; failed: number; errors: string[] }> {
    try {
      if (!attachmentIds || attachmentIds.length === 0) {
        throw new Error("No attachment IDs provided");
      }

      console.log(
        `Starting bulk deletion of ${attachmentIds.length} document attachments`,
      );

      const results = {
        successful: 0,
        failed: 0,
        errors: [] as string[],
      };

      // Process deletions in parallel for better performance
      const deletePromises = attachmentIds.map(async (attachmentId, index) => {
        try {
          console.log(
            `Deleting attachment ${index + 1}/${attachmentIds.length}: ID ${attachmentId}`,
          );
          await this.deleteDocumentAttachment(req, attachmentId);
          results.successful++;
        } catch (error) {
          console.error(
            `Failed to delete attachment ${attachmentId}: ${error.message}`,
          );
          results.failed++;
          results.errors.push(`Attachment ${attachmentId}: ${error.message}`);
        }
      });

      // Wait for all deletions to complete
      await Promise.all(deletePromises);

      console.log(
        `Bulk deletion completed - Successful: ${results.successful}, Failed: ${results.failed}`,
      );
      return results;
    } catch (error) {
      console.error(
        `Error in deleteMultipleDocumentAttachments: ${error.message}`,
      );
      throw error;
    }
  }
}
