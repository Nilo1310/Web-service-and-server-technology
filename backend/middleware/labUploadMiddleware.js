const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt"];
const uploadDir = path.join(__dirname, "..", "uploads", "lab-results");

const hasCloudinaryStorage =
  cloudinary &&
  cloudinary.v2 &&
  cloudinary.v2.uploader &&
  typeof cloudinary.v2.uploader.upload_stream === "function";

const storage = hasCloudinaryStorage
  ? cloudinaryStorage({
      cloudinary,
      folder: "hospital_lab_uploads",
      allowedFormats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "xls", "xlsx", "txt"],
      params: { resource_type: "auto" }
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
      }
    });

const uploadLab = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error("Unsupported lab result file type"));
    }

    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
});

module.exports = uploadLab;
