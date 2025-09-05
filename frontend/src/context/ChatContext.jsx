
import React, { createContext, useContext, useState, useEffect } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {
  const { serverUrl } = useContext(authDataContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); // dynamic users list

  // Fetch all users for chat
  const fetchUsers = async () => {
    try {
      
      const res = await axios.get(`${serverUrl}/api/user/suggestedusers`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.log("Error fetching users:", err);
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
