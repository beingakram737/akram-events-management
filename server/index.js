import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/auth.js";

import ErrorResponse from "./utils/errorResponse.js";
import errorHandler from "./middleware/error.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

// 404
app.use((req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handler
app.use(errorHandler);

// DB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

// Server
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
