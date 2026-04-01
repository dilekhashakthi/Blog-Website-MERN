const multer = require("multer");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

// Use memory storage — we stream the buffer into GridFS manually
// in the controller using the already-open Mongoose connection.
// This avoids multer-gridfs-storage opening a second DB connection.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      Object.assign(
        new Error("Only image files (JPEG, PNG, WebP, GIF) are allowed"),
        { statusCode: 400 },
      ),
      false,
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});

module.exports = upload;
