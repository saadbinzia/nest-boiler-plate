import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  Res,
  StreamableFile,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { createReadStream, existsSync, mkdirSync, statSync } from "fs";
import * as path from "path";
import { ErrorResponse } from "src/core/config/interface/swaggerResponse.dto";

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  // Images
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  // Documents
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  txt: "text/plain",
  // Archives
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  // Media
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  webm: "video/webm",
};

const DEFAULT_MIME_TYPE = "application/octet-stream";

@ApiTags("Files")
@Controller("")
@UseInterceptors(ClassSerializerInterceptor)
export class MediasController {
  private readonly baseDir = path.join(process.cwd(), "uploads");
  private readonly staticDir = path.join(process.cwd(), "static");
  private readonly defaultImage = path.join(
    process.cwd(),
    "assets",
    "no-image.png",
  );

  constructor() {
    // Ensure uploads directory exists
    if (!existsSync(this.baseDir)) {
      mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Serve a file from the uploads directory
   * @param {string[]} pathSegments - Path segments to the file relative to the uploads directory
   * @param {boolean} [download=false] - Whether to force download the file
   * @param {Response} res - Express response object
   */
  @Get("uploads/*path")
  @ApiOperation({
    summary: "Get file",
    description: "Serves a file from the uploads directory",
  })
  @ApiParam({
    name: "path",
    description: "Path to the file relative to the uploads directory",
    example: "videos/my_awesome_video.mp4",
  })
  @ApiQuery({
    name: "download",
    required: false,
    description: "Force file download",
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: "File retrieved successfully",
  })
  @ApiResponse({
    status: 206,
    description: "Partial content retrieved successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid file path",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: "File not found",
    type: ErrorResponse,
  })
  async serveFile(
    @Param("path") pathSegments: string[],
    @Query("download") download: boolean = false,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const filePath = path.join(...pathSegments);

      // Security: Prevent directory traversal
      if (filePath.includes("..")) {
        throw new BadRequestException("Invalid file path");
      }

      const joinedPath = Array.isArray(filePath)
        ? path.join(...filePath)
        : filePath;
      const fullPath = path.join(this.baseDir, joinedPath);

      // Check if file exists
      if (!existsSync(fullPath)) {
        return this.serveDefaultImage(res);
      }

      const stats = statSync(fullPath);
      const fileSize = stats.size;

      const range = req.headers.range;

      const ext = path.extname(fullPath).substring(1).toLowerCase();
      const mimeType = MIME_TYPES[ext] || DEFAULT_MIME_TYPE;

      // Handle Range requests
      if (range && typeof range === "string" && mimeType.startsWith("video/")) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize || start < 0 || start > end) {
          throw new BadRequestException("Range Not Satisfiable");
        }

        const chunksize = end - start + 1;
        const fileStream = createReadStream(fullPath, { start, end });

        res.status(206); // Partial Content
        res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Length", chunksize);
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Cache-Control", "no-cache, private");

        // If download is requested, set Content-Disposition
        if (download) {
          const filename = path.basename(fullPath);
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`,
          );
        }

        return new StreamableFile(fileStream);
      } else {
        // Full file download or if not a video/range request
        res.status(200); // OK
        res.setHeader("Content-Length", fileSize);
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Cache-Control", "public, max-age=31536000");

        // Set Content-Disposition header for downloads
        if (download) {
          const filename = path.basename(fullPath);
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`,
          );
        }

        const fileStream = createReadStream(fullPath);
        return new StreamableFile(fileStream);
      }
    } catch (error) {
      console.error("Error serving file:", error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw error;
    }
  }

  private serveDefaultImage(res: Response): StreamableFile | void {
    if (existsSync(this.defaultImage)) {
      res.setHeader("Content-Type", "image/png");
      const file = createReadStream(this.defaultImage);
      return new StreamableFile(file);
    }
    throw new NotFoundException("Default image not found");
  }

  @Get("static/*path")
  @ApiOperation({
    summary: "Get file",
    description: "Serves a file from the static directory",
  })
  @ApiParam({
    name: "path",
    description: "Path to the file relative to the uploads directory",
    example: "videos/my_awesome_video.mp4",
  })
  @ApiQuery({
    name: "download",
    required: false,
    description: "Force file download",
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: "File retrieved successfully",
  })
  @ApiResponse({
    status: 206,
    description: "Partial content retrieved successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid file path",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: "File not found",
    type: ErrorResponse,
  })
  async serveStaticFile(
    @Param("path") pathSegments: string[],
    @Query("download") download: boolean = false,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const filePath = path.join(...pathSegments);

      // Security: Prevent directory traversal
      if (filePath.includes("..")) {
        throw new BadRequestException("Invalid file path");
      }

      const joinedPath = Array.isArray(filePath)
        ? path.join(...filePath)
        : filePath;
      const fullPath = path.join(this.staticDir, joinedPath);

      // Check if file exists
      if (!existsSync(fullPath)) {
        return this.serveDefaultImage(res);
      }

      const stats = statSync(fullPath);
      const fileSize = stats.size;

      const ext = path.extname(fullPath).substring(1).toLowerCase();
      const mimeType = MIME_TYPES[ext] || DEFAULT_MIME_TYPE;

      // Full file download or if not a video/range request
      res.status(200); // OK
      res.setHeader("Content-Length", fileSize);
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "public, max-age=31536000");

      // Set Content-Disposition header for downloads
      if (download) {
        const filename = path.basename(fullPath);
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`,
        );
      }

      const fileStream = createReadStream(fullPath);
      return new StreamableFile(fileStream);
    } catch (error) {
      console.error("Error serving file:", error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw error;
    }
  }
}
