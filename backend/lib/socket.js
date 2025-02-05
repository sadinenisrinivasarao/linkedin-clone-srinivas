import { io } from "socket.io-client";

// Connect to the server
export const socket = io("http://localhost:5000"); // Your server URL
