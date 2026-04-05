const mongoose = require("mongoose");
const { Readable } = require("stream");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const errorHandler = require("../utils/error");
const { getBucket } = require("../utils/gridfs");


// Helper: upload a buffer into GridFS and return the new file's _id
const uploadBufferToGridFS = (buffer, filename, contentType) => {
  return new Promise((resolve, reject) => {
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(filename, { contentType });

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);

    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.on("error", reject);
  });
};

// PUT /api/user/upload-profile-picture/:id
const uploadProfilePicture = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (!req.file) {
    return next(errorHandler(400, "No image file provided"));
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));

    // Delete the old GridFS file if one exists
    if (user.profilePictureFileId) {
      try {
        const bucket = getBucket();
        await bucket.delete(
          new mongoose.Types.ObjectId(user.profilePictureFileId),
        );
      } catch {
        // Non-fatal: old file may already be gone
      }
    }

    // Stream the in-memory buffer into GridFS
    const filename = `profile_${req.params.id}_${Date.now()}`;
    const newFileId = await uploadBufferToGridFS(
      req.file.buffer,
      filename,
      req.file.mimetype,
    );

    const imageUrl = `/api/user/profile-picture/${newFileId}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          profilePicture: imageUrl,
          profilePictureFileId: newFileId,
        },
      },
      { new: true },
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// GET /api/user/profile-picture/:fileId — streams the image from GridFS
const streamProfilePicture = async (req, res, next) => {
  try {
    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return next(errorHandler(404, "Image not found"));
    }

    res.set("Content-Type", files[0].contentType || "image/jpeg");
    res.set("Cache-Control", "public, max-age=31536000");

    bucket.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    next(error);
  }
};

// PUT /api/user/update/:id
const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters long"));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorHandler(400, "Username must be between 7 and 20 characters long"));
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be in lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, "Username can only contain letters and numbers"));
    }
  }

  try {
    const fields = {};
    if (req.body.username) {
      fields.username = req.body.username;
    }
    if (req.body.email) {
      fields.email = req.body.email;
    }
    if (req.body.password) {
      fields.password = req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: fields },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }

};

module.exports = { uploadProfilePicture, streamProfilePicture, updateUser };
