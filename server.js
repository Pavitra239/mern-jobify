import "express-async-errors"; // avoids app crashing for async errors
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { authenticateUser } from "./middlewares/authMiddleware.js";
// Routes
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
// middlewares
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Job Routes
app.use("/api/v1/jobs", authenticateUser, jobRouter);

// User Routes
app.use("/api/v1/users", authenticateUser, userRouter);

// Auth Routes
app.use("/api/v1/auth", authRouter);

// 404
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Page not found",
  });
});

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5100;
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log("Server started on port 5100");
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
