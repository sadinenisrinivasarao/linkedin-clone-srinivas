import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import { io } from "../server.js";
// Create a new message
export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;
console.log("1",senderId, receiverId, content)
  try {
    // Step 1: Check if a chat already exists between the sender and receiver
    let chat = await Chat.findOne({
      users: { $all: [senderId, receiverId] },
    });

    // Step 2: If no chat exists, create a new one
    if (!chat) {
      chat = new Chat({
        users: [senderId, receiverId],
      });
      await chat.save();
    }

    // Step 3: Create and save the new message
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      chatId: chat._id, // Associate message with the chat
    });

    await newMessage.save();

    // Update the lastMessage in the Chat collection
    chat.lastMessage = newMessage._id;
    await chat.save();

    // Step 4: Emit the message to the sender and receiver
    io.to(senderId).emit("newMessage", newMessage);
    io.to(receiverId).emit("newMessage", newMessage);

    // Step 5: Respond with the new message
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};
