const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String, // URL: /api/post/image/:fileId
    },
    imageFileId: {
      type: String, // GridFS file _id (for deletion)
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;