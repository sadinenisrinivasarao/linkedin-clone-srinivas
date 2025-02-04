import express from "express";
import { getChats, createChat, getMessages, addMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", getChats);
router.post("/", createChat);
router.get("/:chatId/messages", getMessages);
router.post("/:chatId/messages", addMessage);

export default router;
