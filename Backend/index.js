import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import connectionRouter from "./routes/connection.routes.js";
import http from "http";
import { Server } from "socket.io";
import notificationRouter from "./routes/notification.routes.js";

import Chat from "./models/chat.model.js";
import Message from "./models/message.model.js";

dotenv.config();
let app = express();
let server = http.createServer(app);

// ✅ Allowed origins (deployed + local for testing)
const allowedOrigins = [
  "https://linkedin-mega-11frontend.onrender.com",
  "http://localhost:3000",   // React local dev
  "http://localhost:5173"    // Vite local dev
];

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// --- Socket.io ---
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- Routes ---
let port = process.env.PORT || 5000;
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notification", notificationRouter);

import chatRouter from "./routes/chat.routes.js";
app.use("/api/chat", chatRouter);

// --- Socket Maps ---
export const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log("User registered:", userId);
  });

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined room ${chatId}`);
  });

  socket.on("sendMessage", async ({ chatId, senderId, receiverId, message }) => {
    try {
      const newMessage = new Message({ chatId, senderId, receiverId, message });
      await newMessage.save();

      io.to(chatId).emit("receiveMessage", newMessage);
    } catch (err) {
      console.error("Message save error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    for (let [key, value] of userSocketMap.entries()) {
      if (value === socket.id) userSocketMap.delete(key);
    }
    console.log("Socket disconnected:", socket.id);
  });
});

// --- Server ---
server.listen(port, () => {
  connectDb();
  console.log("Server started on port", port);
});
