import React, { createContext } from 'react'

// Capitalized context name
export const AuthDataContext = createContext()

function AuthContext({ children }) {
  const serverUrl = "https://linkedin-mega-backend.onrender.com"

  const value = { serverUrl }

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  )
}

export default AuthContext
