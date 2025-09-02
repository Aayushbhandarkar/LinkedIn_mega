import React, { createContext } from "react";

export const authDataContext = createContext();

function AuthContext({ children }) {
  // ✅ Detect environment
  const serverUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000" // Local backend
      : "https://linkedin-mega-backend.onrender.com"; // Deployed backend

  const value = { serverUrl };

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
}

export default AuthContext;
