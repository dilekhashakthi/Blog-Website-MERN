const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket;

const initGridFS = () => {
  const db = mongoose.connection.db;
  bucket = new GridFSBucket(db, { bucketName: "profilePictures" });
};

const getBucket = () => {
  if (!bucket) throw new Error("GridFS bucket not initialized");
  return bucket;
};

module.exports = { initGridFS, getBucket };