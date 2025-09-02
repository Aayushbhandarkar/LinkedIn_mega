import React, { useContext, useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import moment from "moment"
import { FaRegCommentDots } from "react-icons/fa"
import { BiLike, BiSolidLike } from "react-icons/bi"
import { LuSendHorizontal } from "react-icons/lu"
import { FiMoreHorizontal } from "react-icons/fi"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/userContext'
import { io } from "socket.io-client"
import ConnectionButton from './ConnectionButton'

let socket = io("http://localhost:8000")

function Post({ id, author, like, comment, description, image, createdAt }) {
  let [more, setMore] = useState(false)
  let [menuOpen, setMenuOpen] = useState(false)  // for 3-dots menu
  let { serverUrl } = useContext(authDataContext)
  let { userData, getPost, handleGetProfile } = useContext(userDataContext)
  let [likes, setLikes] = useState(like)
  let [commentContent, setCommentContent] = useState("")
  let [comments, setComments] = useState(comment)
  let [showComment, setShowComment] = useState(false)

  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, { withCredentials: true })
      setLikes(result.data.like)
    } catch (error) {
      console.log(error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    try {
      let result = await axios.post(serverUrl + `/api/post/comment/${id}`, {
        content: commentContent
      }, { withCredentials: true })
      setComments(result.data.comment)
      setCommentContent("")
    } catch (error) {
      console.log(error)
    }
  }

  // DELETE POST
  const handleDelete = async () => {
    try {
      await axios.delete(serverUrl + `/api/post/delete/${id}`, { withCredentials: true })
      getPost()  // refresh posts
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId === id) setLikes(likes)
    })
    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId === id) setComments(comm)
    })
    socket.on("postDeleted", ({ postId }) => {
      if (id === postId) getPost()
    })
    return () => {
      socket.off("likeUpdated")
      socket.off("commentAdded")
      socket.off("postDeleted")
    }
  }, [id])

  useEffect(() => {
    getPost()
  }, [likes, comments])

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-5 flex flex-col gap-4 hover:shadow-lg transition duration-300">
      
      {/* Post Header */}
      <div className="flex justify-between items-start">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition"
          onClick={() => handleGetProfile(author.userName)}
        >
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-gray-200">
            <img src={author.profileImage || dp} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="truncate">
            <h2 className="text-[18px] font-semibold text-gray-800 truncate">
              {`${author.firstName} ${author.lastName}`}
            </h2>
            <p className="text-[14px] text-gray-600 truncate">{author.headline}</p>
            <p className="text-[13px] text-gray-500">{moment(createdAt).fromNow()}</p>
          </div>
        </div>

        {/* 3-Dots Menu */}
        {userData._id === author._id && (
          <div className="relative">
            <FiMoreHorizontal
              className="w-6 h-6 cursor-pointer text-gray-600 hover:text-white hover:bg-gray-700 rounded-full p-1 transition"
              onClick={() => setMenuOpen(prev => !prev)}
            />
            {menuOpen && (
              <div className="absolute right-0 top-6 bg-gray-800 border rounded-md shadow-md flex flex-col w-[120px] z-50">
                <button
                  className="px-4 py-2 text-left text-white hover:bg-gray-700 transition"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}

        {userData._id !== author._id && (
          <ConnectionButton userId={author._id} />
        )}
      </div>

      {/* Post Content */}
      <div className={`text-[15px] text-gray-800 leading-relaxed ${!more ? "line-clamp-3" : ""}`}>
        {description}
      </div>
      {description.length > 120 && (
        <button
          className="text-[#0a66c2] text-[14px] font-semibold cursor-pointer w-fit hover:underline transition"
          onClick={() => setMore(prev => !prev)}
        >
          {more ? "See less" : "See more"}
        </button>
      )}

      {/* Post Image */}
      {image && (
        <div className="w-full rounded-lg overflow-hidden mt-2">
          <img src={image} alt="" className="w-full max-h-[400px] object-cover rounded-lg shadow-sm" />
        </div>
      )}

      {/* Like / Comment Counts */}
      <div className="flex justify-between items-center border-t pt-2 text-[14px] text-gray-600">
        <div className="flex items-center gap-1">
          <BiLike className="text-[#0a66c2]" />
          <span>{likes.length}</span>
        </div>
        <div 
          className="cursor-pointer hover:underline"
          onClick={() => setShowComment(prev => !prev)}
        >
          {comments.length} comments
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around border-t pt-2 text-gray-600 text-[15px] font-medium">
        {!likes.includes(userData._id) ? (
          <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition" onClick={handleLike}>
            <BiLike className="w-[22px] h-[22px]" />
            Like
          </button>
        ) : (
          <button className="flex items-center gap-2 text-[#0a66c2] font-semibold hover:bg-gray-100 p-2 rounded-lg transition" onClick={handleLike}>
            <BiSolidLike className="w-[22px] h-[22px]" />
            Liked
          </button>
        )}

        <button 
          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition"
          onClick={() => setShowComment(prev => !prev)}
        >
          <FaRegCommentDots className="w-[20px] h-[20px]" />
          Comment
        </button>
      </div>

      {/* Comment Section */}
      {showComment && (
        <div className="mt-3">
          <form 
            className="flex items-center gap-2 border rounded-lg px-3 py-2 hover:shadow-sm transition" 
            onSubmit={handleComment}
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 text-[14px] outline-none border-none text-gray-900 bg-white"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button type="submit">
              <LuSendHorizontal className="text-[#0a66c2] w-[20px] h-[20px]" />
            </button>
          </form>

          <div className="flex flex-col gap-4 mt-4">
            {comments.map((com) => (
              <div key={com._id} className="flex gap-3 border-b pb-3 hover:bg-gray-50 transition rounded-lg p-2">
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-gray-200">
                  <img src={com.user.profileImage || dp} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <p className="text-[14px] font-semibold text-gray-800 truncate">
                    {`${com.user.firstName} ${com.user.lastName}`}
                  </p>
                  <p className="text-[14px] text-gray-700 truncate">{com.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Post
