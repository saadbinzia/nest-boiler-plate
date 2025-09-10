import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileCacheService } from "../cache/fileCache.service";

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor(
    private configService: ConfigService,
    private readonly fileCacheService: FileCacheService,
  ) {
    this.region = this.configService.get<string>("AWS_REGION") || "us-east-1";
    this.bucketName =
      this.configService.get<string>("AWS_S3_BUCKET_NAME") ||
      "your-bucket-name";

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get<string>(
          "AWS_SECRET_ACCESS_KEY",
        ),
      },
    });
  }

  async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
    folder: string = "videos",
  ): Promise<string> {
    const fullKey = `${folder}/${key}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fullKey,
      Body: buffer,
      ContentType: contentType,
    });

    try {
      await this.s3Client.send(command);
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fullKey}`;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Failed to upload file to S3");
    }
  }

  async uploadTSFile(
    key: string,
    buffer: Buffer,
    folder: string = "ts",
  ): Promise<string> {
    const fullKey = `${folder}/${key}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fullKey,
      Body: buffer,
      ContentType: "video/mp2t",
    });

    try {
      await this.s3Client.send(command);
      // Store uploaded buffer in local file cache
      await this.ensureCacheInitialized();
      await this.fileCacheService.store(folder, key, buffer);
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fullKey}`;
    } catch (error) {
      console.error("Error uploading TS file to S3:", error);
      throw new Error("Failed to upload TS file to S3");
    }
  }

  async deleteFile(key: string, folder: string = "videos"): Promise<void> {
    const fullKey = `${folder}/${key}`;

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fullKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw new Error("Failed to delete file from S3");
    }
  }

  async getSignedUrl(
    key: string,
    folder: string = "videos",
    expiresIn: number = 3600,
  ): Promise<string> {
    const fullKey = `${folder}/${key}`;

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fullKey,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new Error("Failed to generate signed URL");
    }
  }

  getPublicUrl(key: string, folder: string = "videos"): string {
    const fullKey = `${folder}/${key}`;
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fullKey}`;
  }

  async downloadFile(key: string, folder: string = "videos"): Promise<Buffer> {
    // Kept for backward compatibility (no cache)
    const fullKey = `${folder}/${key}`;
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fullKey,
    });
    try {
      const response = await this.s3Client.send(command);
      if (!response.Body) {
        throw new Error("No body in S3 response");
      }
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      console.error("Error downloading file from S3:", error);
      throw new Error(`Failed to download file from S3: ${error.message}`);
    }
  }

  async downloadFileCached(
    key: string,
    folder: string = "videos",
  ): Promise<Buffer> {
    await this.ensureCacheInitialized();
    return this.fileCacheService.getOrSetBuffer(folder, key, async () => {
      return this.downloadFile(key, folder);
    });
  }

  private cacheInitialized = false;
  private async ensureCacheInitialized(): Promise<void> {
    if (!this.cacheInitialized) {
      await this.fileCacheService.initialize();
      this.cacheInitialized = true;
    }
  }
}
