import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { RxCross1 } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const ChatBox = () => {
  const { selectedChat, messages, setMessages, users, setSelectedChat } = useChat();
  const [newMsg, setNewMsg] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // ✅ Initialize socket only once
  useEffect(() => {
    socketRef.current = io(
      import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : "https://linkedin-mega-backend.onrender.com"
    );

    // Listen for incoming messages
    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [setMessages]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedChat]);

  const sendMessage = (msg) => {
    if (!msg.trim() || !selectedChat) return;

    const msgData = {
      id: uuidv4(),
      sender: "You",
      text: msg,
      timestamp: new Date(),
      chatId: selectedChat.id || selectedChat._id,
    };

    // Add locally
    setMessages([...messages, msgData]);

    // Send to server
    socketRef.current.emit("sendMessage", msgData);

    setNewMsg("");
  };

  const deleteMessage = (msgId) => {
    setMessages(messages.filter((m) => m.id !== msgId));
    socketRef.current.emit("deleteMessage", msgId); // optional if backend supports it
  };

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
          onClick={() => setIsOpen(true)}
        >
          Open Chat
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-[400px] h-[500px] lg:h-[600px] flex flex-col border shadow-2xl bg-white rounded-t-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
        <div className="flex items-center gap-3">
          {selectedChat ? (
            <>
              <img
                src={selectedChat.avatar || "/default-avatar.png"}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div>
                <h2 className="font-bold text-sm truncate">{selectedChat.name}</h2>
                <span className="text-xs text-gray-200">
                  {selectedChat.online ? "Online" : "Offline"}
                </span>
              </div>
            </>
          ) : (
            <span className="font-bold">Select a chat</span>
          )}
        </div>
        <button onClick={() => setIsOpen(false)}>
          <RxCross1 className="w-6 h-6 hover:text-gray-200 transition" />
        </button>
      </div>

      {!selectedChat ? (
        <>
          {/* User search & list */}
          <div className="flex flex-col h-full">
            <div className="flex items-center p-2 border-b">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search users..."
                className="flex-1 p-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {filteredUsers?.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id || user._id}
                    onClick={() => setSelectedChat(user)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition rounded-md"
                  >
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="truncate">
                      <p className="font-medium text-gray-800 truncate">{user.name}</p>
                      <span
                        className={`text-xs ${
                          user.online ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        {user.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 mt-4">No users found</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-2">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 mt-5">No messages yet</p>
            ) : (
              messages.map((msg) => (
                <Message key={msg.id} msg={msg} deleteMessage={deleteMessage} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Chat Input */}
          <ChatInput onSend={sendMessage} newMsg={newMsg} setNewMsg={setNewMsg} />
        </>
      )}
    </div>
  );
};

// ChatInput Component
const ChatInput = ({ onSend, newMsg, setNewMsg }) => {
  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    onSend && onSend(newMsg);
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-4 border-t bg-white flex gap-3 shadow-inner"
    >
      <input
        type="text"
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-3 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition duration-300 shadow-md"
        aria-label="Send Message"
      >
        Send
      </button>
    </form>
  );
};

// Message Component
const Message = ({ msg, deleteMessage }) => {
  const isUser = msg.sender === "You";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} relative`}>
      <div
        className={`relative max-w-[70%] p-2 rounded-lg ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {msg.text}
        {isUser && (
          <button
            onClick={() => deleteMessage(msg.id)}
            className="absolute top-1 right-1 text-xs text-red-500 hover:text-red-700"
            title="Delete Message"
          >
            <RxCross1 size={12} />
          </button>
        )}
        <span className="text-xs text-gray-300 block text-right mt-1">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatBox;
