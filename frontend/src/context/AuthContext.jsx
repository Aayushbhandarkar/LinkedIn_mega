import React, { createContext } from "react";

export const AuthDataContext = createContext();

function AuthContext({ children }) {
  // ✅ Detect environment
  const serverUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000" // Local backend
      : "https://linkedin-mega-backend.onrender.com"; // Deployed backend

  const value = { serverUrl };

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  );
}

export default AuthContext;
