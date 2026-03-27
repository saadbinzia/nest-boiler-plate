import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Storage } from "@google-cloud/storage";
import { FileCacheService } from "../cache/fileCache.service";

@Injectable()
export class GCSService {
  private storage: Storage;
  private bucketName: string;
  private projectId: string;

  constructor(
    private configService: ConfigService,
    private readonly fileCacheService: FileCacheService,
  ) {
    this.projectId = this.configService.get<string>("GCS_PROJECT_ID");
    this.bucketName = this.configService.get<string>("GCS_BUCKET_NAME");

    // Validate GCS configuration
    if (!this.projectId) {
      console.error(
        "GCS project ID is not properly configured. Please set GCS_PROJECT_ID in your environment variables.",
      );
      throw new Error("GCS project ID not configured");
    }

    if (!this.bucketName) {
      console.error(
        "GCS bucket name is not properly configured. Please set GCS_BUCKET_NAME in your environment variables.",
      );
      throw new Error("GCS bucket not configured");
    }

    // Initialize Google Cloud Storage
    this.storage = new Storage({
      projectId: this.projectId,
      // Credentials will be loaded from environment variables or service account key file
      keyFilename: this.configService.get<string>("GCS_KEY_FILE_PATH"), // Optional: path to service account key file
    });
  }

  async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
    folder: string = "videos",
  ): Promise<string> {
    const fullKey = `${folder}/${key}`;

    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fullKey);

      await file.save(buffer, {
        metadata: {
          contentType: contentType,
        },
      });

      // Return the public URL
      return `https://storage.googleapis.com/${this.bucketName}/${fullKey}`;
    } catch (error) {
      console.error("Error uploading to GCS:", error);

      // Create a proper error object with status code
      const gcsError = new Error(
        "Failed to upload file to Google Cloud Storage",
      );
      gcsError.name = "BadRequestError";

      // Add more specific error messages based on the error type
      if (
        error.message?.includes("credential") ||
        error.message?.includes("authentication")
      ) {
        gcsError.message =
          "Google Cloud credentials are invalid or not properly configured";
      } else if (error.message?.includes("bucket")) {
        gcsError.message = "GCS bucket does not exist or is not accessible";
      } else if (
        error.message?.includes("permission") ||
        error.message?.includes("access")
      ) {
        gcsError.message =
          "Access denied to GCS bucket. Check your Google Cloud permissions";
      }

      throw gcsError;
    }
  }

  async uploadTSFile(
    key: string,
    buffer: Buffer,
    folder: string = "ts",
  ): Promise<string> {
    const fullKey = `${folder}/${key}`;

    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fullKey);

      await file.save(buffer, {
        metadata: {
          contentType: "application/octet-stream",
        },
      });

      return `https://storage.googleapis.com/${this.bucketName}/${fullKey}`;
    } catch (error) {
      console.error("Error uploading TS file to GCS:", error);
      throw new Error("Failed to upload TS file to Google Cloud Storage");
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(key);

      await file.delete();
    } catch (error) {
      console.error("Error deleting file from GCS:", error);
      throw new Error("Failed to delete file from Google Cloud Storage");
    }
  }

  async downloadBuffer(objectPath: string): Promise<Buffer> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(objectPath);
      const [buf] = await file.download();
      return buf;
    } catch (error) {
      console.error("Error downloading file from GCS:", error);
      throw new Error("Failed to download file from Google Cloud Storage");
    }
  }

  async getSignedUrl(key: string, expiration: number = 3600): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(key);

      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + expiration * 1000,
      });

      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL from GCS:", error);
      throw new Error(
        "Failed to generate signed URL from Google Cloud Storage",
      );
    }
  }

  async getPublicUrl(key: string): Promise<string> {
    return `https://storage.googleapis.com/${this.bucketName}/${key}`;
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(key);
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      console.error("Error checking file existence in GCS:", error);
      return false;
    }
  }

  async getFileMetadata(key: string): Promise<any> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(key);
      const [metadata] = await file.getMetadata();
      return metadata;
    } catch (error) {
      console.error("Error getting file metadata from GCS:", error);
      throw new Error("Failed to get file metadata from Google Cloud Storage");
    }
  }

  async listFiles(
    prefix: string = "",
    maxResults: number = 1000,
  ): Promise<string[]> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [files] = await bucket.getFiles({
        prefix: prefix,
        maxResults: maxResults,
      });

      return files.map((file) => file.name);
    } catch (error) {
      console.error("Error listing files from GCS:", error);
      throw new Error("Failed to list files from Google Cloud Storage");
    }
  }
}
