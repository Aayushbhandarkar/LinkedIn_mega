import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "./context/AuthContext.jsx";
import UserContext from "./context/UserContext.jsx";
import ChatContext from "./context/ChatContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContext>
      <UserContext>
        <ChatContext>
          <ThemeProvider> 
            <App />
          </ThemeProvider>
        </ChatContext>
      </UserContext>
    </AuthContext>
  </BrowserRouter>
);
