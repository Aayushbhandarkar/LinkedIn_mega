import React, { createContext, useContext, useState, useEffect } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {
  const { serverUrl } = useContext(authDataContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO with correct URL and websocket transport
  useEffect(() => {
    const newSocket = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket"], 
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [serverUrl]);

  // Fetch all users for chat
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/suggestedusers`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
