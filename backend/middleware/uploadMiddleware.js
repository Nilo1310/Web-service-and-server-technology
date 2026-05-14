const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
const uploadDir = path.join(__dirname, "..", "uploads", "skin-images");

const hasCloudinaryStorage =
  cloudinary &&
  cloudinary.v2 &&
  cloudinary.v2.uploader &&
  typeof cloudinary.v2.uploader.upload_stream === "function";

const storage = hasCloudinaryStorage
  ? cloudinaryStorage({
      cloudinary,
      folder: "hospital_skin_uploads",
      allowedFormats: ["jpg", "jpeg", "png", "gif"],
      transformation: [{ width: 800, height: 800, crop: "limit" }]
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

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error("Only jpg, jpeg, png and gif images are allowed"));
    }

    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;
