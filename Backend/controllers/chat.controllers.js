import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

/**
 * Create a chat between logged-in user (req.userId) and receiverId.
 * If chat exists, return it. Else create and return new chat.
 */
export const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!receiverId) return res.status(400).json({ message: "receiverId is required" });

    let chat = await Chat.findOne({
      members: { $all: [userId, receiverId] }
    });

    if (!chat) {
      chat = new Chat({ members: [userId, receiverId] });
      await chat.save();
    }

    return res.json(chat);
  } catch (err) {
    console.error("createChat error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get all chats where logged-in user is a member
 */
export const getUserChats = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const chats = await Chat.find({ members: userId })
      .populate("members", "firstName lastName userName profileImage")
      .sort({ updatedAt: -1 });

    return res.json(chats);
  } catch (err) {
    console.error("getUserChats error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get all messages of a chat
 */
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) return res.status(400).json({ message: "chatId is required" });

    const messages = await Message.find({ chatId })
      .populate("senderId", "firstName lastName userName profileImage")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Send a message in a chat
 */
export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const senderId = req.userId;

    if (!chatId || !message) return res.status(400).json({ message: "Chat ID and message required" });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const newMsg = new Message({
      chatId,
      senderId,
      receiverId: chat.members.find((id) => id.toString() !== senderId),
      message
    });

    await newMsg.save();

    const populatedMsg = await newMsg.populate("senderId", "firstName lastName userName profileImage");

    return res.status(201).json(populatedMsg);
  } catch (err) {
    console.error("sendMessage error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    if (!messageId) return res.status(400).json({ message: "Message ID required" });

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    if (msg.senderId.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    await Message.findByIdAndDelete(messageId);
    return res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("deleteMessage error:", err);
    return res.status(500).json({ message: err.message });
  }
};
