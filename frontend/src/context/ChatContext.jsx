import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthDataContext } from "./AuthContext"; // ✅ Fix import
import axios from "axios";
import { io } from "socket.io-client";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {
  const { serverUrl } = useContext(AuthDataContext); // ✅ Fix context usage
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ Initialize Socket.IO
  useEffect(() => {
    if (!serverUrl) return;

    const newSocket = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket"], // force websocket
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [serverUrl]);

  // ✅ Fetch all users for chat
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/suggestedusers`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [serverUrl]); // ✅ include serverUrl

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
        users,
        socket,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
