import React, { useEffect, useRef, useState, useContext } from "react";
import { IoSend } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import { authDataContext } from "../../context/AuthContext";
import axios from "axios";
import io from "socket.io-client";
import dp from "../../assets/dp.webp"; // ✅ fallback check

const Message = ({ msg, onDelete }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isOwn = msg.senderId?._id === user?._id;

  return (
    <div className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            src={msg.senderId?.profilePic || dp}
            alt={msg.senderId?.firstName || "user"}
          />
        </div>
      </div>
      <div className="chat-header">
        {msg.senderId?.firstName || "Unknown"}
        <time className="text-xs opacity-50">12:45</time>
      </div>
      <div className="chat-bubble">{msg.message}</div>
      {isOwn && (
        <button
          onClick={() => onDelete(msg._id)}
          className="chat-footer opacity-50 flex items-center"
        >
          <TiDelete className="text-red-600" />
        </button>
      )}
    </div>
  );
};

const MessageList = ({ messages, onDelete }) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg) => (
        <Message key={msg._id || Math.random()} msg={msg} onDelete={onDelete} />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

const InputBox = ({ message, setMessage, onSend }) => (
  <form
    onSubmit={onSend}
    className="flex items-center border-t border-gray-300 p-4"
  >
    <input
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="flex-1 border rounded-lg p-2 focus:outline-none"
    />
    <button
      type="submit"
      className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
    >
      <IoSend size={20} />
    </button>
  </form>
);

const ChatBox = ({ selectedUser, setSelectedUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { serverUrl } = useContext(authDataContext);

  const socket = useRef(null);

  useEffect(() => {
    if (serverUrl) {
      socket.current = io(serverUrl, { withCredentials: true });
    }

    return () => {
      socket.current?.disconnect();
    };
  }, [serverUrl]);

  useEffect(() => {
    if (!selectedUser?._id || !serverUrl) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/chat/${selectedUser._id}/messages`,
          { withCredentials: true }
        );
        setMessages(res.data || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, serverUrl]);

  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("newMessage", (newMsg) => {
      if (newMsg.chatId === selectedUser?._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });

    return () => {
      socket.current?.off("newMessage");
    };
  }, [selectedUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser?._id || !serverUrl) return;

    try {
      const res = await axios.post(
        `${serverUrl}/api/chat/send/${selectedUser._id}`,
        { message },
        { withCredentials: true }
      );
      setMessage("");
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const deleteMessage = async (msgId) => {
    try {
      await axios.delete(`${serverUrl}/api/chat/delete/${msgId}`, {
        withCredentials: true,
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h2 className="text-gray-500 text-lg">Select a user to start chat</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-l border-gray-300">
      <div className="flex items-center p-4 border-b border-gray-300">
        <img
          src={selectedUser.profilePic || dp}
          alt={selectedUser.firstName || "user"}
          className="w-10 h-10 rounded-full"
        />
        <h2 className="ml-2 font-semibold">{selectedUser.firstName}</h2>
      </div>
      <MessageList messages={messages} onDelete={deleteMessage} />
      <InputBox message={message} setMessage={setMessage} onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;
