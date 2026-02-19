require("dotenv").config({path: '../.env'});
const express = require("express");
const mongoose = require("mongoose");

const app = express();

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
