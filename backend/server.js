import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import http from "http"; // For WebSocket server
import { Server } from "socket.io"; // For WebSocket server

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import chatRoutes from "./routes/chat.routes.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Socket.IO instance with proper CORS configuration
const io = new Server(server, {
  cors: {
    origin: "https://linkedin-clone-srinivas.onrender.com", // Replace with frontend domain
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json({ limit: "5mb" })); 
app.use(cookieParser());

const __dirname = path.resolve();

// CORS setup
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "https://linkedin-clone-srinivas.onrender.com",
      credentials: true,
    })
  );
}

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/chat", chatRoutes);

// Static files in production
if (process.env.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // Catch-all route for serving React app's index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Socket.IO Events
io.on("connection", (socket) => {
  
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    
  });

  // Broadcast messages to the specific room
  socket.on("send_message", (data) => {
    
    io.to(data.chatId).emit("receive_message", data);
  });

 
});

// Debugging endpoint for testing purposes
app.post("/chat", (req, res) => {
  const { senderId, receiverId, message } = req.body;
 
  res.status(201).json({
    success: true,
    message: "Chat created successfully",
    chat: { senderId, receiverId, message },
  });
});

// Server Start
server.listen(process.env.PORT || 5000, () => {
 
  connectDB();
});
