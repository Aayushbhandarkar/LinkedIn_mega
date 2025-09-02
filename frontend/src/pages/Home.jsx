import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/dp.webp"
import { FiPlus, FiCamera } from "react-icons/fi"
import { userDataContext } from '../context/userContext'
import { HiPencil } from "react-icons/hi2"
import EditProfile from '../components/EditProfile'
import { RxCross1 } from "react-icons/rx"
import { BsImage } from "react-icons/bs"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import Post from '../components/Post'
import ConnectionButton from '../components/ConnectionButton'

function Home() {
  let { userData, edit, setEdit, postData, getPost, handleGetProfile } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)
  let [frontendImage, setFrontendImage] = useState("")
  let [backendImage, setBackendImage] = useState("")
  let [description, setDescription] = useState("")
  let [uploadPost, setUploadPost] = useState(false)
  let image = useRef()
  let [posting, setPosting] = useState(false)
  let [suggestedUser, setSuggestedUser] = useState([])

  function handleImage(e) {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  async function handleUploadPost() {
    setPosting(true)
    try {
      let formdata = new FormData()
      formdata.append("description", description)
      if (backendImage) formdata.append("image", backendImage)
      await axios.post(serverUrl + "/api/post/create", formdata, { withCredentials: true })
      setPosting(false)
      setUploadPost(false)
      setDescription("")
      setFrontendImage("")
      setBackendImage("")
    } catch (error) {
      setPosting(false)
      console.log(error)
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/suggestedusers", { withCredentials: true })
      setSuggestedUser(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleSuggestedUsers()
  }, [])

  useEffect(() => {
    getPost()
  }, [uploadPost])

  return (
    <div className="w-full min-h-screen bg-[#f4f2ee] pt-20 flex justify-center items-start gap-6 px-4 pb-10 relative">
      {edit && <EditProfile />}
      <Nav />

      {/* Left Sidebar - Profile Card */}
      <div className="hidden lg:flex lg:w-1/4 flex-col gap-6 sticky top-24">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="relative h-20 bg-gradient-to-r from-blue-700 to-blue-800 cursor-pointer" onClick={() => setEdit(true)}>
            <img src={userData.coverImage || ""} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-end justify-end p-2">
              <FiCamera className="w-5 h-5 text-white cursor-pointer hover:scale-110 transition" />
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="flex justify-center -mt-10 mb-2">
              <div className="relative group" onClick={() => setEdit(true)}>
                <img 
                  src={userData.profileImage || dp} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover group-hover:brightness-90 transition duration-300" 
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0a66c2] rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition">
                  <FiPlus className="text-white text-xs" />
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 truncate px-2">{`${userData.firstName} ${userData.lastName}`}</h2>
              <p className="text-sm text-gray-600 mt-1 truncate px-2">{userData.headline || "Add a headline"}</p>
              <p className="text-xs text-gray-500 mt-1 truncate px-2">{userData.location}</p>
            </div>

            <hr className="border-gray-200 my-3" />

            <button
              className="w-full py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] font-medium flex items-center justify-center gap-2 hover:bg-[#eef6ff] transition duration-300"
              onClick={() => setEdit(true)}
            >
              <HiPencil className="text-sm" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="w-full lg:w-2/4 flex flex-col gap-4">
        {/* Create Post Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img src={userData.profileImage || dp} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button
            className="flex-1 h-12 border border-gray-300 rounded-full px-5 text-left text-gray-500 hover:bg-gray-50 transition-all"
            onClick={() => setUploadPost(true)}
          >
            Start a post
          </button>
        </div>

        {/* Posts */}
        {postData.map((post, index) => (
          <Post
            key={index}
            id={post._id}
            description={post.description}
            author={post.author}
            image={post.image}
            like={post.like}
            comment={post.comment}
            createdAt={post.createdAt}
          />
        ))}
      </div>

      {/* Right Sidebar - Suggested Users */}
      <div className="hidden lg:flex lg:w-1/4 flex-col gap-6 sticky top-24">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">Suggested Users</h1>
          {suggestedUser.length > 0 ? (
            <div className="flex flex-col gap-3">
              {suggestedUser.map((su, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div 
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    onClick={() => handleGetProfile(su.userName)}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img src={su.profileImage || dp} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">{`${su.firstName} ${su.lastName}`}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{su.headline}</p>
                    </div>
                  </div>
                  <ConnectionButton userId={su._id} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No suggested users</p>
          )}
        </div>
      </div>

      {/* Upload Post Modal */}
      {uploadPost && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setUploadPost(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[600px] bg-white rounded-xl shadow-2xl z-50 p-6 flex flex-col gap-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800">Create a post</h2>
              <button 
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setUploadPost(false)}
              >
                <RxCross1 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={userData.profileImage || dp} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">{`${userData.firstName} ${userData.lastName}`}</h3>
                <p className="text-xs text-gray-500">Post to anyone</p>
              </div>
            </div>

            <textarea
              className="w-full h-40 resize-none outline-none text-gray-700 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent transition-all"
              placeholder="What do you want to talk about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {frontendImage && (
              <div className="w-full h-64 overflow-hidden rounded-lg border border-gray-200 relative">
                <img src={frontendImage} alt="Post preview" className="w-full h-full object-contain" />
                <button 
                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  onClick={() => {
                    setFrontendImage("")
                    setBackendImage("")
                  }}
                >
                  <RxCross1 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <div className="flex items-center gap-4">
                <button 
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => image.current.click()}
                >
                  <BsImage className="w-5 h-5" />
                </button>
                <input type="file" ref={image} hidden onChange={handleImage} />
              </div>
              <button
                className="px-6 py-2 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={posting || (!description.trim() && !backendImage)}
                onClick={handleUploadPost}
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Home