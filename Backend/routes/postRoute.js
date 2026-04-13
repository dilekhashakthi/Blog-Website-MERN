const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/verifyToken");
const { create, uploadPostImage, streamPostImage } = require("../controllers/postController");

const router = express.Router();

// Create a post (admin only)
router.post("/create", verifyToken, create);

// Upload a post image to GridFS (admin only)
router.put(
  "/upload-image/:userId",
  verifyToken,
  upload.single("postImage"),
  uploadPostImage,
);

// Stream a post image from GridFS (public)
router.get("/image/:fileId", streamPostImage);

module.exports = router;