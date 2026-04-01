import multer from "multer";
import HttpException from "../models/http-exception.model";
import { StatusCodes } from "http-status-codes";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const photoUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new HttpException(StatusCodes.BAD_REQUEST, { error: "O arquivo enviado deve ser uma imagem" }));
      return;
    }

    cb(null, true);
  },
});
