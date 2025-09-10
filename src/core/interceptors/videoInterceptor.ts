import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

export const VideoInterceptor = () =>
  FileInterceptor("file", {
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(mp4)$/)) {
        const error = new Error("file_type_not_mp4");
        error.name = "BadRequestError";
        return callback(error, false);
      }
      callback(null, true);
    },
  });
