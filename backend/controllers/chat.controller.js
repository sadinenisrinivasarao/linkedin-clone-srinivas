import Chat from "../models/chat.model.js";

export const getChats = async (req, res) => {
  const chats = await Chat.find();
  res.json(chats);
};

export const createChat = async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  const newChat = new Chat({ participants: [senderId, receiverId], messages: [{ senderId, content: message }] });
  await newChat.save();
  res.json(newChat);
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const chat = await Chat.findById(chatId);
  res.json(chat.messages);
};

export const addMessage = async (req, res) => {
  const { chatId } = req.params;
  const { senderId, content } = req.body;
  const chat = await Chat.findById(chatId);
  chat.messages.push({ senderId, content });
  await chat.save();
  res.json(chat);
};
