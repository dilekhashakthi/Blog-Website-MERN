require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoute.js");
const authRoutes = require("./routes/authRoute.js");
const logger = require("./middleware/logger.js");
const { initGridFS } = require("./utils/gridfs.js");

const app = express();

app.use(express.json());
app.use(cookieParser()); // Required for verifyToken to read cookies
app.use(logger);

async function DBconnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully...");
    initGridFS(); // Initialize GridFS AFTER mongoose connects
  } catch (error) {
    console.log("Database connection failed...");
    console.error(error);
  }
}

DBconnection();

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Global error handler
app.use((err, req, res, next) => {
  // Handle Multer-specific errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "File size exceeds the 2MB limit",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});