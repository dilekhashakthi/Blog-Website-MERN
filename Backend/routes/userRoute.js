const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/verifyToken");
const {
  uploadProfilePicture,
  streamProfilePicture,
} = require("../controllers/userController");

const router = express.Router();

// Stream a profile picture from GridFS (public)
router.get("/profile-picture/:fileId", streamProfilePicture);

// Upload / replace profile picture (protected)
router.put(
  "/upload-profile-picture/:id",
  verifyToken,
  upload.single("profilePicture"),
  uploadProfilePicture
);

module.exports = router;