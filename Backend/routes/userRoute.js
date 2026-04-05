const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/verifyToken");
const {
  uploadProfilePicture,
  streamProfilePicture,
  updateUser,
  deletedUser,
  signout,
} = require("../controllers/userController");

const router = express.Router();

// Update user (protected)
router.put("/update/:id", verifyToken, updateUser);

// Stream a profile picture from GridFS (public)
router.get("/profile-picture/:fileId", streamProfilePicture);

// Upload / replace profile picture (protected)
router.put(
  "/upload-profile-picture/:id",
  verifyToken,
  upload.single("profilePicture"),
  uploadProfilePicture
);

// Delete user (protected)
router.delete("/delete/:id", verifyToken, deletedUser);

// Signout user
router.post("/signout", signout);

module.exports = router;
