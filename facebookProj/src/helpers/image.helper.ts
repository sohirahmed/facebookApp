import fs from "fs/promises";
import fsSync from "fs";
export class ImageHelper {
  static saveImageAsync(fileName: string, buffer: Buffer) {
    return fs.writeFile(`./public/images/${fileName}`, buffer);
  }
  static saveImageSync(fileName: string, buffer: Buffer) {
    return fsSync.writeFileSync(`./public/images/${fileName}`, buffer);
  }

  static deleteImage(fileName: string) {
    return fs.unlink(`./public/images/${fileName}`);
  }
}
