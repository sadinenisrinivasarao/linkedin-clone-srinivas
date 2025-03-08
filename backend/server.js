import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io"; 

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import chatRoutes from "./routes/chat.routes.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST"],
  },  
});

app.use(express.json({ limit: "5mb" })); 
app.use(cookieParser());

const __dirname = path.resolve();


  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1", chatRoutes);

if (process.env.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));


  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

io.on("connection", (socket) => {
  
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    
  });

  socket.on("send_message", (data) => {
    
    io.to(data.chatId).emit("receive_message", data);
  });

 
});

app.post("/chat", (req, res) => {
  const { senderId, receiverId, message } = req.body;
 
  res.status(201).json({
    success: true,
    message: "Chat created successfully",
    chat: { senderId, receiverId, message },
  });
});

server.listen(process.env.PORT || 5000, () => {
 console.log(`Server running on port ${process.env.PORT || 5000}`);
  connectDB();
});



export { server, io };