import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/userContext'
import { Eye, EyeOff } from "lucide-react"  

function Login() {
  let [show, setShow] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let { setUserData } = useContext(userDataContext)
  let navigate = useNavigate()
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl + "/api/auth/login", {
        email,
        password
      }, { withCredentials: true })
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setEmail("")
      setPassword("")
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed")
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Main Container */}
      <div className="w-full max-w-6xl flex rounded-xl shadow-lg overflow-hidden bg-white">
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-[#004182] to-[#0077B5] p-10 text-white">
          <div className="flex flex-col justify-center">
            <img src={logo} alt="LinkedIn Logo" className="w-40 mb-8" />
            <h1 className="text-4xl font-light mb-6">Welcome to your professional community</h1>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <span className="text-lg">🔍</span>
                </div>
                <p>Find the right job or internship</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <span className="text-lg">👥</span>
                </div>
                <p>Connect with people who can help</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <span className="text-lg">🎓</span>
                </div>
                <p>Learn new skills to advance your career</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-8">
              <img src={logo} alt="LinkedIn Logo" className="w-32" />
            </div>

            <h2 className="text-3xl font-light text-gray-900 mb-2">Sign in</h2>
            <p className="text-gray-600 mb-8">Stay updated on your professional world</p>

            <form onSubmit={handleSignIn} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email 
                </label>
                <input 
                  id="email"
                  type="email" 
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-gray-900 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or phone number"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input 
                    id="password"
                    type={show ? "text" : "password"} 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-gray-900 transition pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#0A66C2] transition"
                    onClick={() => setShow(prev => !prev)}
                  >
                    {show ? <EyeOff size={20}/> : <Eye size={20}/>}
                  </button>
                </div>
              </div>

              {/* Removed Forgot Password */}

              {/* Error Message */}
              {err && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-700 text-sm text-center">* {err}</p>
                </div>
              )}

              {/* Sign In Button */}
              <button 
                type="submit"
                className="w-full py-3 bg-[#0A66C2] text-white font-semibold rounded-full hover:bg-[#004182] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : "Sign in"}
              </button>
            </form>

            {/* Separator */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Sign Up Option */}
            <div className="text-center">
              <p className="text-gray-600">New to LinkedIn?</p>
              <button 
                onClick={() => navigate("/signup")}
                className="mt-2 px-6 py-2 border border-gray-300 rounded-full text-[#0A66C2] font-semibold hover:bg-[#E8F0FE] transition"
              >
                Join now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center">
        <div className="text-xs text-gray-600">
          <span className="font-semibold">LinkedIn member directory:</span>
          <span className="ml-2">ConnectPro Network: A platform to connect professionals worldwide.</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          ©{new Date().getFullYear()}  ConnectPro. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default Login
