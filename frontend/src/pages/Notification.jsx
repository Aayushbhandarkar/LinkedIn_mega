import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { RxCross1 } from 'react-icons/rx'
import dp from '../assets/dp.webp'
import moment from 'moment'

function Notification() {
  const { serverUrl } = useContext(authDataContext)
  const { userData } = useContext(userDataContext)
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/notification/get`, { withCredentials: true })
      setNotifications(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/notification/deleteone/${id}`, { withCredentials: true })
      fetchNotifications()
    } catch (err) {
      console.log(err)
    }
  }

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`${serverUrl}/api/notification`, { withCredentials: true })
      fetchNotifications()
    } catch (err) {
      console.log(err)
    }
  }

  const notificationMessage = (type) => {
    if (type === 'like') return 'liked your post'
    if (type === 'comment') return 'commented on your post'
    if (type === 'connection') return 'accepted your connection request'
    return 'did something'
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className="w-full min-h-screen bg-[#f3f2ef] pt-[100px] px-4 flex flex-col items-center gap-6">
      <Nav />

      {/* Header */}
      <div className="w-full max-w-[900px] flex items-center justify-between bg-white shadow-md rounded-lg px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Notifications <span className="text-gray-500">({notifications.length})</span>
        </h2>
        {notifications.length > 0 && (
          <button
            className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition"
            onClick={clearAllNotifications}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notification List */}
      {notifications.length > 0 ? (
        <div className="w-full max-w-[900px] flex flex-col gap-2">
          {notifications.map((noti, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 gap-4 relative"
            >
              {/* Left: User & Notification Content */}
              <div className="flex gap-4 flex-1 cursor-pointer">
                <div className="w-[55px] h-[55px] rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                  <img
                    src={noti.relatedUser.profileImage || dp}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-800 text-[15px] leading-snug">
                    <span className="font-semibold">
                      {noti.relatedUser.firstName} {noti.relatedUser.lastName}
                    </span>{' '}
                    {notificationMessage(noti.type)}
                  </p>
                  {noti.relatedPost && (
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 border hover:shadow-sm transition">
                      <div className="w-[80px] h-[60px] rounded-md overflow-hidden border flex-shrink-0">
                        <img
                          src={noti.relatedPost.image}
                          alt="post"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{noti.relatedPost.description}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400">{moment(noti.createdAt).fromNow()}</p>
                </div>
              </div>

              {/* Right: Delete Button */}
              <button
                className="absolute right-3 top-3 md:static text-gray-400 hover:text-red-600 transition"
                onClick={() => deleteNotification(noti._id)}
              >
                <RxCross1 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-[900px] bg-white shadow-md rounded-lg flex flex-col items-center justify-center p-10 gap-2 text-gray-500">
          <p className="text-lg font-medium">No new notifications</p>
          <p className="text-sm text-gray-400">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

export default Notification
