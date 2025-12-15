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

/* =======================
   MIDDLEWARE
======================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",       // local frontend
      "https://akram-events-management.netlify.app" // future Netlify URL
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =======================
   ROOT ROUTE (RENDER FIX)
======================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Akram Events Management API is running 🚀",
  });
});

/* =======================
   API ROUTES
======================= */
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

/* =======================
   404 HANDLER (LAST)
======================= */
app.use((req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use(errorHandler);

/* =======================
   DATABASE + SERVER
======================= */
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
