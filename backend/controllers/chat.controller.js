import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import { io } from "../server.js";

export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;
console.log("1",senderId, receiverId, content)
  try {
    
    let chat = await Chat.findOne({
      users: { $all: [senderId, receiverId] },
    });

  
    if (!chat) {
      chat = new Chat({
        users: [senderId, receiverId],
      });
      await chat.save();
    }

   
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      chatId: chat._id, 
    });

    await newMessage.save();

   
    chat.lastMessage = newMessage._id;
    await chat.save();

    io.to(senderId).emit("newMessage", newMessage);
    io.to(receiverId).emit("newMessage", newMessage);

   
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};


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
