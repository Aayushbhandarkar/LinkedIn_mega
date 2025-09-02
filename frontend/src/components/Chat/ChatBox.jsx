import React, { useState, useEffect, useRef, useContext } from "react";
import { useChat } from "../../context/ChatContext";
import { RxCross1 } from "react-icons/rx";
import { FiArrowLeft } from "react-icons/fi";
import { io } from "socket.io-client";
import axios from "axios";
import { authDataContext } from "../../context/AuthContext";
import dp from "../../assets/dp.webp"; // default image

const ChatInput = ({ newMsg, setNewMsg, onSend, inputRef }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSend(newMsg);
    }}
    className="flex items-center p-4 border-t bg-white gap-3"
  >
    <input
      type="text"
      ref={inputRef}
      value={newMsg}
      onChange={(e) => setNewMsg(e.target.value)}
      placeholder="Type a message..."
      className="flex-1 p-3 border border-gray-200 rounded-full outline-none 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200
                 shadow-sm hover:shadow-md"
    />
    <button
      type="submit"
      disabled={!newMsg.trim()}
      className="bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 
                 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all 
                 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
    >
      Send
    </button>
  </form>
);

const ChatBox = ({ closeChat }) => {
  const { selectedChat, setSelectedChat, messages, setMessages, users } = useChat();
  const { serverUrl } = useContext(authDataContext);
  const [newMsg, setNewMsg] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [showDelete, setShowDelete] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const socket = useRef(io(serverUrl, { withCredentials: true })).current;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedChat]);

  useEffect(() => {
    if (!userId) return;
    socket.emit("register", userId);
  }, [userId, socket]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off("receiveMessage");
  }, [socket, setMessages]);

  const axiosConfig = { withCredentials: true };

  useEffect(() => {
    if (!selectedChat?._id) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/chat/${selectedChat._id}/messages`, axiosConfig);
        setMessages(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [selectedChat, serverUrl, setMessages]);

  const sendMessage = async (text) => {
    if (!text.trim() || !selectedChat?._id) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/chat/send`,
        { chatId: selectedChat._id, message: text },
        axiosConfig
      );
      const msgData = res.data;
      socket.emit("sendMessage", msgData);
      setMessages((prev) => [...prev, msgData]);
      setNewMsg("");
      inputRef.current.focus();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (msgId) => {
    try {
      await axios.delete(`${serverUrl}/api/chat/delete/${msgId}`, axiosConfig);
      setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
      setShowDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserClick = async (user) => {
    if (!user?._id) return;
    try {
      const res = await axios.post(`${serverUrl}/api/chat/`, { receiverId: user._id }, axiosConfig);
      if (res.data?._id) setSelectedChat(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users?.filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    return fullName.includes(searchUser.toLowerCase());
  });

  const Message = ({ msg }) => {
    if (!msg?.senderId?._id) return null;
    const isSender = msg.senderId._id === userId;

    return (
      <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
        {!isSender && (
          <img
            src={msg.senderId.profileImage || dp}
            alt="user"
            className="w-10 h-10 rounded-full mr-3 self-end flex-shrink-0"
          />
        )}

        <div className="relative max-w-[75%]">
          <div
            className={`p-4 rounded-2xl break-words shadow-sm transition-all duration-300 
              ${isSender 
                ? "bg-blue-600 text-white rounded-br-md" 
                : "bg-gray-100 text-gray-800 rounded-bl-md"
              }`}
          >
            {msg.message}
          </div>

          {isSender && (
            <div className="absolute -top-1 -right-6">
              <button
                className="text-gray-400 hover:text-gray-600 font-bold px-1 py-1 rounded-full 
                           hover:bg-gray-200 transition-colors"
                onClick={() => setShowDelete(showDelete === msg._id ? null : msg._id)}
              >
                ⋮
              </button>
              {showDelete === msg._id && (
                <div className="absolute right-0 mt-1 w-28 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => deleteMessage(msg._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}

          <div className={`text-xs text-gray-400 mt-1 ${isSender ? "text-right" : "text-left"}`}>
            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        {isSender && (
          <img
            src={msg.senderId.profileImage || dp}
            alt="you"
            className="w-10 h-10 rounded-full ml-3 self-end flex-shrink-0"
          />
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-white flex flex-col shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
          {selectedChat ? (
            <div className="flex items-center gap-3">
              <button
                className="p-1 rounded-full hover:bg-blue-500 transition-colors"
                onClick={() => setSelectedChat(null)}
              >
                <FiArrowLeft size={20} />
              </button>
              <div className="relative">
                <img
                  src={selectedChat.members?.find((m) => m._id !== userId)?.profileImage || dp}
                  alt="chat user"
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                  ${selectedChat.members?.find((m) => m._id !== userId)?.online ? "bg-green-400" : "bg-gray-300"}`}
                />
              </div>
              <div>
                <h2 className="text-md font-semibold truncate max-w-[140px]">
                  {selectedChat.members?.find((m) => m._id !== userId)?.firstName}{" "}
                  {selectedChat.members?.find((m) => m._id !== userId)?.lastName}
                </h2>
                <span className="text-xs opacity-90">
                  {selectedChat.members?.find((m) => m._id !== userId)?.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          ) : (
            <h2 className="font-semibold text-lg">Messages</h2>
          )}
          <button 
            className="p-1 rounded-full hover:bg-blue-500 transition-colors"
            onClick={closeChat}
          >
            <RxCross1 size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {!selectedChat ? (
            <div className="w-full md:w-1/3 border-r flex flex-col bg-gray-50">
              {/* Search */}
              <div className="p-3 border-b bg-white">
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Search users..."
                  className="w-full p-3 border border-gray-200 rounded-full outline-none 
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-200
                            shadow-sm hover:shadow-md"
                />
              </div>

              {/* Users List */}
              <div className="flex-1 overflow-y-auto p-2">
                {filteredUsers?.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleUserClick(user)}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 rounded-xl transition-all duration-200 ease-in-out mb-2"
                    >
                      <div className="relative">
                        <img
                          src={user.profileImage || dp}
                          alt={user.firstName}
                          className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                          ${user.online ? "bg-green-400" : "bg-gray-300"}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs ${user.online ? "text-green-600" : "text-gray-400"}`}>
                            {user.online ? "Online" : "Offline"}
                          </span>
                          {user.isConnection && (
                            <span className="text-xs text-blue-500 font-medium">• Connection</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6">
                    <p className="text-gray-400">No users found</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <Message key={msg._id} msg={msg} />
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">No messages yet. Start a conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <ChatInput
                newMsg={newMsg}
                setNewMsg={setNewMsg}
                onSend={sendMessage}
                inputRef={inputRef}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;