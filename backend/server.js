


import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import session from "express-session";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";

// Connect to DB
connectDB();

const app = express();

// ------------------------------------
// ✅ CORS (IMPORTANT: only ONE CORS setup)
// ------------------------------------
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // allow cookies + auth
  })
);

// ------------------------------------
// 🔥 IMPORTANT FOR FILE UPLOADS
// ------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ← required for multipart/form-data

// ------------------------------------
// Cookies + Session
// ------------------------------------
app.use(cookieParser());

app.use(
  session({
    secret: "MISNA_SECRET_123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// ------------------------------------
// Routes
// ------------------------------------
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🛒 API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
