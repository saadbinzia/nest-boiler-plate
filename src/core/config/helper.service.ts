import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import Jimp from "jimp";
import mergeImages from "merge-images";
import { Canvas, Image } from "canvas";
import https from "https";
import sizeOf from "image-size";
import { AuthenticatedRequest } from "./interface/request.interface";

/**
 * HelperService
 *
 * @description This class will be used to contain all the functions that we need on multiple locations like rounding off a number or resizing image etc.
 */
@Injectable()
export class HelperService {
  /**
   * Round number up to 2 decimal places.
   *
   * @param {number} num Any number we want to round of to 2 decimal characters
   * @returns {number}
   */
  round(num: number): number {
    if (num && !isNaN(num)) {
      return Number((Math.round(num * 100) / 100).toFixed(2));
    }
    return 0;
  }

  /**
   * Split the file location string to file path and file .
   *
   * @param {string} file string
   * @returns { { path: string, file_name: string } } returns an object that contains the path and file name
   */

  getFilePathAndName(file: string): { path: string; file_name: string } {
    const parts = file.split("/");
    const file_name = parts.pop() ?? ""; // Safely get the last element
    const file_path = parts.join("/") + "/"; // Rejoin the rest as path

    return { path: file_path, file_name: file_name };
  }

  /**
   *
   * @param {string} file file with complete path i.e. uploads/users/116/946229e4-19dc-4562-957f-d3fb949609b8.png
   *
   * @description it will check for the path first if it exist than it will delete it other wise return true
   * @returns {any}
   */
  async deleteFile(file: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(file)) {
        fs.unlink(file, function (err) {
          if (err) {
            console.error("delete file error");
            console.error(err);
            reject(err);
          }
        });
      }
      resolve(true);
    });
  }

  /**
   * This function is used to resize the image
   * @param {any} file
   * @param {number} width
   * @param {number} height
   * @param {number} quality
   * @param {boolean}keepRatio
   * @returns {any}
   */
  /**
   * This function is used to resize the image
   * @param {any} file
   * @param {number} width
   * @param {number} height
   * @param {number} quality
   * @param {boolean}keepRatio
   * @returns {any}
   */
  async resizeImage(
    file: any,
    width: number,
    height: number,
    quality: number = 60,
    keepRatio: boolean = false,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      Jimp.read(file, (err: any, img: any) => {
        if (err) return resolve(err);

        let width2 = width;
        let height2 = height;

        if (keepRatio) {
          const w = img.bitmap.width;
          const h = img.bitmap.height;
          const r = this.calculateAspectRatioFit(w, h, width, height);
          width2 = r.width;
          height2 = r.height;
        }

        const fileData = this.getFilePathAndName(file);

        img
          .resize(width2, height2)
          .quality(quality)
          .writeAsync(
            fileData.path + width + "x" + height + "_" + fileData.file_name,
          );

        resolve(true);
      }).catch(function (err) {
        console.error(err);
        reject(err);
      });
    });
  }

  /**
   * This function is used to resize the image buffer and return a buffer
   * @param {Buffer} buffer
   * @param {number} width
   * @param {number} height
   * @param {number} quality
   * @param {boolean} keepRatio
   * @returns {Promise<Buffer>}
   */
  async resizeImageBuffer(
    buffer: Buffer,
    width: number,
    height: number,
    quality: number = 60,
    keepRatio: boolean = false,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      Jimp.read(buffer, (err: any, img: any) => {
        if (err) {
          reject(err);
          return;
        }

        let width2 = width;
        let height2 = height;

        if (keepRatio) {
          const w = img.bitmap.width;
          const h = img.bitmap.height;
          const r = this.calculateAspectRatioFit(w, h, width, height);
          width2 = r.width;
          height2 = r.height;
        }

        img
          .resize(width2, height2)
          .quality(quality)
          .getBufferAsync(Jimp.AUTO)
          .then((resizedBuffer: Buffer) => {
            resolve(resizedBuffer);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    });
  }

  /**
   * Calculate the aspect ratio
   * @param {number} srcWidth
   * @param {number} srcHeight
   * @param {number} maxWidth
   * @param {number} maxHeight
   * @returns {any}
   */
  calculateAspectRatioFit(
    srcWidth: number,
    srcHeight: number,
    maxWidth: number,
    maxHeight: number,
  ): any {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }

  /**
   * Add play button to video thumbnail
   * @param {string} image
   * @returns {any}
   */
  addPlayButton(image: string): any {
    return new Promise((resolve) => {
      let playButton: string | Uint8Array;
      // obtain the size of an image
      const mainImageDimensions = sizeOf(image);
      if (
        mainImageDimensions.width > 2400 &&
        mainImageDimensions.height > 2400
      ) {
        playButton = "./static/play_button/700x700_play-button-image.png";
      } else if (
        mainImageDimensions.width > 1500 &&
        mainImageDimensions.height > 1500
      ) {
        playButton = "./static/play_button/560x560_play-button-image.png";
      } else if (
        mainImageDimensions.width > 900 &&
        mainImageDimensions.height > 900
      ) {
        playButton = "./static/play_button/420x420_play-button-image.png";
      } else if (
        mainImageDimensions.width > 600 &&
        mainImageDimensions.height > 600
      ) {
        playButton = "./static/play_button/280x280_play-button-image.png";
      } else if (
        mainImageDimensions.width > 300 &&
        mainImageDimensions.height > 300
      ) {
        playButton = "./static/play_button/140x140_play-button-image.png";
      } else {
        playButton = "./static/play_button/70x70_play-button-image.png";
      }
      const playButtonDimensions = sizeOf(playButton);

      const xPostion =
        (mainImageDimensions.width - playButtonDimensions.width) / 2;
      const yPostion =
        (mainImageDimensions.height - playButtonDimensions.height) / 2;
      mergeImages(
        [
          { src: image, x: 0, y: 0 },
          { src: playButton, x: xPostion, y: yPostion },
        ],
        {
          Canvas: Canvas,
          Image: Image,
        },
      ).then((img: any) => {
        const base64Data = img.replace(/^data:image\/png;base64,/, "");
        const fileData = this.getFilePathAndName(image);
        fs.writeFile(
          fileData.path + "play_" + fileData.file_name,
          base64Data,
          "base64",
          function (err: any) {
            console.error(err);
          },
        );
        resolve(true);
      });
    });
  }

  /**
   * This function will check the path if it don't exit so it will create that path
   * @param {string} path path that we need to check
   * @returns {any}
   */
  async createDirectory(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(path)) {
        resolve(true);
      } else {
        fs.mkdir(path, { recursive: true }, (error) => {
          if (error) {
            reject(error);
          }
          resolve(true);
        });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  /**
   * This function will check the path if it exit or not
   * @param {string} path path that we need to check
   * @returns {boolean}
   */
  async pathExist(path: string): Promise<any> {
    return new Promise((resolve) => {
      if (fs.existsSync(path)) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  /**
   * This function will create a file to a specific location
   * @param {string} path path where we need to create file
   * @param {any} buffer file buffer or file data
   * @param {any} type type of file
   * @returns
   */

  CreateFile(path: string, buffer: any, type: any) {
    return new Promise((resolve, reject) => {
      fs.writeFile(`${path}`, buffer, type, (e: any) => {
        if (e) {
          console.error(e);
          reject(e);
        }
        resolve(true);
      });
    });
  }

  /**
   * Download image from and online link in a specific path
   * @param {string} path
   * @param {string} link
   * @returns {any}
   */
  async CreateImageFromInternet(path: string, link: string): Promise<any> {
    return new Promise((resolve) => {
      const file = fs.createWriteStream(path);
      https.get(link, function (response) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      });
    });
  }

  /**
   * copy file (image)
   * @param {string} previousPath
   * @param {string} newPath
   */
  CopyFile(previousPath: string, newPath: string) {
    return new Promise((resolve, reject) => {
      // destination will be created or overwritten by default.
      fs.copyFile(previousPath, newPath, (e) => {
        if (e) {
          console.error(e);
          reject(e);
        }
        resolve(true);
      });
    });
  }

  /**
   * Extract token from header
   * @description Used to extract token value from header.
   * @param {AuthenticatedRequest} request
   * @returns {String}
   */
  extractTokenFromHeader(request: AuthenticatedRequest): string {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  /**
   * Calculate duration in minutes
   * @param {string} startTime  '10:10'
   * @param {string} endTime  '13:20'
   */
  calculateMinutesDifference(startTime: string, endTime: string) {
    if (startTime && endTime) {
      // Split the time strings into hours and minutes
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      // Calculate the difference in minutes
      let diffInMinutes =
        endHour * 60 + endMinute - (startHour * 60 + startMinute);

      // Handle the case when the end time is earlier than the start time
      if (diffInMinutes < 0) {
        // Add 24 hours (1440 minutes) to the difference
        diffInMinutes += 1440;
      }

      return diffInMinutes;
    } else {
      return 0;
    }
  }
}
