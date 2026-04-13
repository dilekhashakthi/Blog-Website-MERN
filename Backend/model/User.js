const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    // Stores the GridFS file _id so we can delete the old file on re-upload
    profilePictureFileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
