import { io } from "socket.io-client";


export const socket = io("http://localhost:5000", {
  transports: ["websocket"], 
});

socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
});

export const initSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
