import express from "express";
import {
  createChat,
  getUserChats,
  getMessages,
  sendMessage,
  deleteMessage
} from "../controllers/chat.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const chatRouter = express.Router();

// Create a chat
chatRouter.post("/", isAuth, createChat);

// Get all chats of logged-in user
chatRouter.get("/", isAuth, getUserChats);

// Get messages of a specific chat
chatRouter.get("/:chatId/messages", isAuth, getMessages);

// Send a message in a chat
chatRouter.post("/send", isAuth, sendMessage);

// Delete a message
chatRouter.delete("/delete/:messageId", isAuth, deleteMessage);

export default chatRouter;
