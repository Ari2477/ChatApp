import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

// FIX: Correct __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",
  "https://full-stack-chatapp-1aq1.onrender.com",
];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 🔥 CRITICAL FIX: ADD THIS ROOT ROUTE
app.get("/", (req, res) => {
  res.json({ 
    status: "ok",
    service: "Chat App Backend",
    endpoints: ["/api/auth", "/api/messages", "/health"]
  });
});

// Keep your existing production code
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`✅ Server running on PORT: ${PORT}`);
  connectDB();
});
