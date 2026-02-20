import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import envConfig from '../config/env.config.js';



const MAX_IMAGE_SIZE = 100 * 1024; 
const MAX_DOC_SIZE = 2 * 1024 * 1024; 

const IMAGE_TYPES = ["image/jpeg", "image/png"];
const DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ...IMAGE_TYPES,
];



export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOC_SIZE },
});



const s3 = new S3Client({
  region: envConfig.AWS_REGION,
  credentials: {
    accessKeyId: envConfig.AWS_ACCESS_KEY,
    secretAccessKey: envConfig.AWS_SECRET_KEY,
  },
});



const sanitizeFilename = (name) => {
  const ext = path.extname(name);
  const base = path.basename(name, ext).replace(/[^a-zA-Z0-9]/g, "_");
  return `${Date.now()}_${base}${ext}`;
};


export const validateFile = async (file, type = "doc") => {
  if (!file) throw new Error("File is required");

  if (type === "image") {
    if (!IMAGE_TYPES.includes(file.mimetype)) {
      throw new Error("Only JPG and PNG images allowed");
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Image size must be ≤ 100KB");
    }

    const meta = await sharp(file.buffer).metadata();
    if (meta.width !== 512 || meta.height !== 512) {
      throw new Error("Image must be exactly 512x512");
    }
  }

  if (type === "doc") {
    if (!DOC_TYPES.includes(file.mimetype)) {
      throw new Error("Invalid document type");
    }
  }
};



export const saveToLocal = async (file, folder = "uploads") => {
  const uploadDir = path.join(process.cwd(), "public", folder);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filename = sanitizeFilename(file.originalname);
  const fullPath = path.join(uploadDir, filename);

  fs.writeFileSync(fullPath, file.buffer);

  return `/public/${folder}/${filename}`;
};


export const saveToS3 = async (file, keyPrefix = "uploads") => {
  const filename = sanitizeFilename(file.originalname);

  const command = new PutObjectCommand({
    Bucket: envConfig.AWS_BUCKET,
    Key: `${keyPrefix}/${filename}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return `${keyPrefix}/${filename}`;
};


export const handleUpload = async ({
  file,
  type = "doc",            // "image" | "doc"
  localFolder = "uploads",
  s3Folder = "uploads",
}) => {
  await validateFile(file, type);

  if (envConfig.STORAGE_TYPE === "s3") {
    return await saveToS3(file, s3Folder);
  } else {
    return await saveToLocal(file, localFolder);
  }
};
