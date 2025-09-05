import React, { createContext } from "react";

export const AuthDataContext = createContext();

function AuthProvider({ children }) {
  const serverUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://linkedin-mega-backend.onrender.com";

  const value = { serverUrl };

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  );
}

export default AuthProvider;
