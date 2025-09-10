import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

export const ImageFileInterceptor = () =>
  FileInterceptor("thumbnail", {
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        const error = new Error("file_type_not_image");
        error.name = "BadRequestError";
        return callback(error, false);
      }
      callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });
