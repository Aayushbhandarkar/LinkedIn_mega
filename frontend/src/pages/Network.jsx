import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import dp from "../assets/dp.webp"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { RxCrossCircled } from "react-icons/rx"
import io from "socket.io-client"

const socket = io("http://localhost:8000")

function Network() {
  let { serverUrl } = useContext(authDataContext)
  let [connections, setConnections] = useState([])

  const handleGetRequests = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/requests`, { withCredentials: true })
      setConnections(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleAcceptConnection = async (requestId) => {
    try {
      await axios.put(`${serverUrl}/api/connection/accept/${requestId}`, {}, { withCredentials: true })
      setConnections(connections.filter((con) => con._id !== requestId))
    } catch (error) {
      console.log(error)
    }
  }

  const handleRejectConnection = async (requestId) => {
    try {
      await axios.put(`${serverUrl}/api/connection/reject/${requestId}`, {}, { withCredentials: true })
      setConnections(connections.filter((con) => con._id !== requestId))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetRequests()
  }, [])

  return (
    <div className="w-screen min-h-screen bg-[#f3f2ef] pt-[100px] px-4 flex flex-col items-center gap-6">
      <Nav />

      {/* Header */}
      <div className="w-full max-w-[900px] bg-white shadow-md rounded-lg flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Invitations <span className="text-gray-500">({connections.length})</span>
        </h2>
      </div>

      {/* Invitations List */}
      {connections.length > 0 ? (
        <div className="w-full max-w-[900px] bg-white shadow-md rounded-lg divide-y">
          {connections.map((connection, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-5 hover:bg-gray-50 transition"
            >
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-[55px] h-[55px] rounded-full overflow-hidden cursor-pointer border">
                  <img
                    src={connection.sender.profileImage || dp}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-gray-800">
                    {connection.sender.firstName} {connection.sender.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Wants to connect with you</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a66c2] text-white font-medium hover:bg-[#004182] transition"
                  onClick={() => handleAcceptConnection(connection._id)}
                >
                  <IoIosCheckmarkCircleOutline className="w-5 h-5" />
                  Accept
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-400 text-gray-600 font-medium hover:bg-gray-100 transition"
                  onClick={() => handleRejectConnection(connection._id)}
                >
                  <RxCrossCircled className="w-5 h-5" />
                  Ignore
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-[900px] bg-white shadow-md rounded-lg p-10 flex justify-center items-center text-gray-500">
          No pending invitations
        </div>
      )}
    </div>
  )
}

export default Network
