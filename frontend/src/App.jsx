import React, { useContext, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { userDataContext } from './context/userContext'
import Network from './pages/Network'
import Profile from './pages/Profile'
import Notification from './pages/Notification'
import { useTheme } from "./context/ThemeContext.jsx";

function App() {
  const { userData } = useContext(userDataContext)
  const { theme } = useTheme() // use hook

  useEffect(() => {
    document.documentElement.className = ""
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Routes>
        <Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />
        <Route path='/signup' element={userData ? <Navigate to="/" /> : <Signup />} />
        <Route path='/login' element={userData ? <Navigate to="/" /> : <Login />} />
        <Route path='/network' element={userData ? <Network /> : <Navigate to="/login" />} />
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/login" />} />
        <Route path='/notification' element={userData ? <Notification /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
