require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute.js");
const authRoutes = require("./routes/authRoute.js");
const logger = require("./middleware/logger.js");

const app = express();
app.use(express.json());
app.use(logger);

async function DBconnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully...");
  } catch (error) {
    console.log("Database connection failed...");
    console.error(error);
  }
}

DBconnection();

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
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
