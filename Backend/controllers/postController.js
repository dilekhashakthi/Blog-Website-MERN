const mongoose = require("mongoose");
const { Readable } = require("stream");
const Post = require("../model/Post");
const errorHandler = require("../utils/error");
const { getPostImagesBucket } = require("../utils/gridfs");

// Helper: stream a buffer into GridFS and return the new file's _id
const uploadBufferToGridFS = (bucket, buffer, filename, contentType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, { contentType });
    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.on("error", reject);
  });
};

// PUT /api/post/upload-image/:userId
const uploadPostImage = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to upload post images"));
  }

  if (!req.file) {
    return next(errorHandler(400, "No image file provided"));
  }

  try {
    const bucket = getPostImagesBucket();
    const filename = `post_image_${req.user.id}_${Date.now()}`;
    const fileId = await uploadBufferToGridFS(
      bucket,
      req.file.buffer,
      filename,
      req.file.mimetype,
    );

    const imageUrl = `/api/post/image/${fileId}`;
    res.status(200).json({ imageUrl, fileId: fileId.toString() });
  } catch (error) {
    next(error);
  }
};

// GET /api/post/image/:fileId — streams a post image from GridFS
const streamPostImage = async (req, res, next) => {
  try {
    const bucket = getPostImagesBucket();
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

// POST /api/post/create
const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userID: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, uploadPostImage, streamPostImage };
