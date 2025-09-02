import React, { useContext, useEffect, useState } from 'react'
import logo2 from "../assets/logo2.png"
import { IoSearchSharp } from "react-icons/io5"
import { TiHome } from "react-icons/ti"
import { FaUserGroup } from "react-icons/fa6"
import { IoNotificationsSharp } from "react-icons/io5"
import { FiMessageSquare } from "react-icons/fi"
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/userContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ChatBox from "../components/Chat/ChatBox" // Import ChatBox

function Nav() {
  let [activeSearch, setActiveSearch] = useState(false)
  let { userData, setUserData, handleGetProfile } = useContext(userDataContext)
  let [showPopup, setShowPopup] = useState(false)
  let [chatOpen, setChatOpen] = useState(false)
  let navigate = useNavigate()
  let { serverUrl } = useContext(authDataContext)
  let [searchInput, setSearchInput] = useState("")
  let [searchData, setSearchData] = useState([])

  const handleSignOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      setUserData(null)
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, { withCredentials: true })
      setSearchData(result.data)
    } catch (error) {
      setSearchData([])
    }
  }

  useEffect(() => {
    if (searchInput.trim() !== "") {
      handleSearch()
    } else {
      setSearchData([])
    }
  }, [searchInput])

  return (
    <>
      <div className="w-full h-16 bg-white fixed top-0 shadow-sm border-b border-gray-200 flex justify-between items-center px-4 md:px-8 left-0 z-50">
        {/* Left Section: Logo + Search */}
        <div className="flex items-center gap-4 relative">
          <div 
            onClick={() => { setActiveSearch(false); navigate("/") }}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img src={logo2} alt="logo" className="w-10 h-10" />
          </div>

          {/* Mobile Search Toggle */}
          {!activeSearch && (
            <button
              className="p-2 rounded-full text-gray-500 lg:hidden hover:bg-gray-100 transition-colors"
              onClick={() => setActiveSearch(true)}
            >
              <IoSearchSharp className="w-5 h-5" />
            </button>
          )}

          {/* Search Bar */}
          <div
            className={`relative ${!activeSearch ? "hidden lg:flex" : "flex absolute top-16 left-0 right-0 mx-4 lg:static lg:mx-0"}`}
          >
            <div className="relative w-full lg:w-80">
              <div className="flex items-center bg-[#edf3f8] rounded-md px-3 py-2.5 w-full hover:bg-[#e1e9f0] transition-colors">
                <IoSearchSharp className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-sm placeholder-gray-500 text-gray-900"
                  placeholder="Search users..."
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
                {activeSearch && (
                  <button 
                    className="text-gray-400 hover:text-gray-600 ml-2"
                    onClick={() => setActiveSearch(false)}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchData.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden z-50">
                  {searchData.map((sea, i) => (
                    <div
                      key={i}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => {
                        handleGetProfile(sea.userName);
                        setSearchInput("");
                        setSearchData([]);
                        setActiveSearch(false);
                      }}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mr-3">
                        <img src={sea.profileImage || dp} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{`${sea.firstName} ${sea.lastName}`}</p>
                        <p className="text-xs text-gray-500 truncate">{sea.headline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Nav Icons */}
        <div className="flex items-center gap-1 md:gap-4">

          {/* Navigation Items */}
          <div className="flex items-center">
            <button
              className="flex flex-col items-center px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors group"
              onClick={() => navigate("/")}
            >
              <TiHome className="w-6 h-6 group-hover:text-[#0a66c2]" />
              <span className="text-xs mt-1 hidden md:block">Home</span>
            </button>

            <button
              className="flex flex-col items-center px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors group"
              onClick={() => navigate("/network")}
            >
              <FaUserGroup className="w-6 h-6 group-hover:text-[#0a66c2]" />
              <span className="text-xs mt-1 hidden md:block">Network</span>
            </button>

            <button
              className="flex flex-col items-center px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors group"
              onClick={() => navigate("/notification")}
            >
              <IoNotificationsSharp className="w-6 h-6 group-hover:text-[#0a66c2]" />
              <span className="text-xs mt-1 hidden md:block">Notifications</span>
            </button>

            {/* Chat Icon */}
            <button
              className="flex flex-col items-center px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors group"
              onClick={() => setChatOpen(true)}
            >
              <FiMessageSquare className="w-6 h-6 group-hover:text-[#0a66c2]" />
              <span className="text-xs mt-1 hidden md:block">Chat</span>
            </button>
          </div>

          {/* Profile Section */}
          <div className="relative ml-2">
            <button
              className="flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowPopup(!showPopup)}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                <img src={userData.profileImage || dp} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </button>

            {/* Profile Popup */}
            {showPopup && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-4 flex flex-col items-center border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-white shadow-md">
                    <img src={userData.profileImage || dp} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 text-center">{`${userData.firstName} ${userData.lastName}`}</p>
                  <p className="text-sm text-gray-500 text-center mt-1">{userData.headline || "No headline"}</p>
                </div>

                <div className="p-2">
                  <button
                    className="w-full py-2.5 px-4 text-center text-[#0a66c2] font-medium rounded-md hover:bg-[#eef6ff] transition-colors"
                    onClick={() => {
                      handleGetProfile(userData.userName);
                      setShowPopup(false);
                    }}
                  >
                    View Profile
                  </button>
                </div>

                <div className="p-2 border-t border-gray-100">
                  <button
                    className="w-full py-2.5 px-4 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center"
                    onClick={() => {
                      navigate("/network");
                      setShowPopup(false);
                    }}
                  >
                    <FaUserGroup className="w-4 h-4 mr-2" />
                    <span>My Networks</span>
                  </button>
                </div>

                <div className="p-2 border-t border-gray-100">
                  <button
                    className="w-full py-2.5 px-4 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl h-full max-h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <ChatBox closeChat={() => setChatOpen(false)} />
            <button
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-colors"
              onClick={() => setChatOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Nav