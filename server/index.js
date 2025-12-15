import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

/* ======================
   MIDDLEWARE
====================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://akram-events-management.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ======================
   ROOT ROUTE (Render Health Check)
====================== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Akram Events Management API is running 🚀",
  });
});

/* ======================
   API TEST ROUTE (DEBUG)
====================== */
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API working fine ✅",
  });
});

/* ======================
   FAVICON FIX
====================== */
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

/* ======================
   ROUTES
====================== */
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

/* ======================
   SAFE 404 HANDLER
====================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* ======================
   DATABASE + SERVER
====================== */
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
