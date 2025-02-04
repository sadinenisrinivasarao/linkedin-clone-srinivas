import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: String,
  content: String,
});

const chatSchema = new mongoose.Schema({
  participants: [String],
  messages: [messageSchema],
});

export default mongoose.model("Chat", chatSchema);
