require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require('./routes/userRoute.js')

const app = express();
app.use(express.json());

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

app.use('/api', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
