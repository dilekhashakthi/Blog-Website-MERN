const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let profileBucket;
let postImagesBucket;

const initGridFS = () => {
  const db = mongoose.connection.db;
  profileBucket = new GridFSBucket(db, { bucketName: "profilePictures" });
  postImagesBucket = new GridFSBucket(db, { bucketName: "postImages" });
};

const getProfileBucket = () => {
  if (!profileBucket) throw new Error("GridFS profile bucket not initialized");
  return profileBucket;
};

const getPostImagesBucket = () => {
  if (!postImagesBucket)
    throw new Error("GridFS post images bucket not initialized");
  return postImagesBucket;
};

module.exports = { initGridFS, getProfileBucket, getPostImagesBucket };