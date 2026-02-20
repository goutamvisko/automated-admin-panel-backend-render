import multer from "multer";
import envConfig from '../config/env.config.js';

export const multerErrorHandler = (err, req, res, next) => {
  if (!err) return next();


  if (err instanceof multer.MulterError) {
    let message = err.message;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum allowed size is 2 MB";
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field uploaded";
    }

    return res.status(400).json({
      status: false,
      statusCode: 400,
      message,
    });
  }


  const knownMessages = [
    "Invalid file type",
    "Image must be 512x512",
    "Image size must not exceed",
    "File size must not exceed",
    "Image buffer missing",
    "Only JPG and PNG images are allowed",
  ];

  if (
    typeof err.message === "string" &&
    knownMessages.some((msg) => err.message.includes(msg))
  ) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }


  if (
    err.name === "SharpError" ||
    err.message?.includes("Input buffer contains unsupported image format")
  ) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Invalid or corrupted image file",
    });
  }


  console.error("Multer Unknown Error:", err);

  return res.status(500).json({
    status: false,
    statusCode: 500,
    message: "File upload failed",
    error: envConfig.NODE_ENV === "development" ? err.message : undefined,
  });
};
