import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/userContext'
import { Eye, EyeOff } from "lucide-react"

function Signup() {
  let [show, setShow] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let { setUserData } = useContext(userDataContext)
  let navigate = useNavigate()
  let [firstName, setFirstName] = useState("")
  let [lastName, setLastName] = useState("")
  let [userName, setUserName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl + "/api/auth/signup", {
        firstName,
        lastName,
        userName,
        email,
        password
      }, { withCredentials: true })
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setUserName("")
    } catch (error) {
      setErr(error.response?.data?.message || "Signup failed")
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
            <h1 className="text-4xl font-light mb-6">Join your professional community</h1>
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

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-8">
              <img src={logo} alt="LinkedIn Logo" className="w-32" />
            </div>

            <h2 className="text-3xl font-light text-gray-900 mb-2">Sign Up</h2>
            <p className="text-gray-600 mb-8">Create your account and join your professional network</p>

            <form onSubmit={handleSignUp} className="space-y-6">
              {/* First Name */}
              <input 
                type="text"
                placeholder="First Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-gray-900 transition"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              {/* Last Name */}
              <input 
                type="text"
                placeholder="Last Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-gray-900 transition"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />

              {/* Username */}
              <input 
                type="text"
                placeholder="Username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-gray-900 transition"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />

              {/* Email */}
              <input 
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-gray-900 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password */}
              <div className="relative">
                <input 
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-gray-900 transition pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#0A66C2] transition"
                  onClick={() => setShow(prev => !prev)}
                >
                  {show ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>

              {err && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-700 text-sm text-center">* {err}</p>
                </div>
              )}

              {/* Buttons Row */}
              <div className="flex w-full justify-between gap-4">
                <button 
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-1/2 py-3 bg-white text-[#0A66C2] font-semibold rounded-full border border-gray-300 hover:bg-gray-100 transition"
                >
                  Sign In
                </button>

                <button 
                  type="submit"
                  className="w-1/2 py-3 bg-[#0A66C2] text-white font-semibold rounded-full hover:bg-[#004182] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </form>

            {/* Separator */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Footer Info */}
            <div className="text-center text-gray-600 text-sm">
              ConnectPro Network: <span className="ml-2">A platform to connect professionals worldwide.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
