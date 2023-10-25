import { UnsupportedMediaTypeException } from "@nestjs/common"
import { diskStorage } from "multer"
import { FileInterceptor } from "@nestjs/platform-express"
import * as fs from 'fs'

const SIZE_SUPPORTED = 5 * 1024 * 1024

export const multerConfig = (folder: string, filetype: string) => {
  const config = {
    fileFilter: (req, file, cb) => {
      if (filetype.includes(file.mimetype)) cb(null, true)
      else
        cb(
          new UnsupportedMediaTypeException(
            `Filetype not allowed. Must be one of the followings: ${filetype}`
          ),
          false
        )
    },
    limits: { fileSize: SIZE_SUPPORTED },
    storage: diskStorage({
      destination: (req, file, callback) => {
        const parsed_destination = `${folder}/${parse_to_filename(file.originalname)}`
        fs.mkdirSync(parsed_destination, { recursive: true })
        callback(null, parsed_destination)
      },
      filename: (req, file, callback) => {
        const filename = parse_to_filename(file.originalname)
        callback(null, filename)
      },
    }),
  }

  return FileInterceptor("file", config)
}

function parse_to_filename(file_original_name: string) {
  return `${new Date().toISOString().split("T")[1]}-${file_original_name.split(" ").join("-")}`
}
