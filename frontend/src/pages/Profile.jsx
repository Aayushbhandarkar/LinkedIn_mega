import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/userContext'
import { HiPencil } from "react-icons/hi2"
import { authDataContext } from '../context/AuthContext'
import EditProfile from '../components/EditProfile'
import Post from '../components/Post'
import ConnectionButton from '../components/ConnectionButton'
import { FaBriefcase, FaGraduationCap } from "react-icons/fa"
import { IoIosPeople } from "react-icons/io"

function Profile() {
  let { userData, edit, setEdit, postData, profileData } = useContext(userDataContext)
  let [profilePost, setProfilePost] = useState([])
  let { serverUrl } = useContext(authDataContext)

  useEffect(() => {
    setProfilePost(postData.filter((post) => post.author._id === profileData._id))
  }, [profileData, postData])

  return (
    <div className="w-full min-h-screen bg-[#f4f2ee] flex flex-col items-center pt-20 pb-10">
      <Nav />
      {edit && <EditProfile />}

      <div className="w-full max-w-4xl flex flex-col gap-6 px-4">

        {/* Profile Header Card */}
        <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Cover Image */}
          <div className="w-full h-52 bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden">
            {profileData.coverImage ? (
              <img src={profileData.coverImage} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Add a cover photo</span>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Profile Avatar */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="relative -mt-16 md:-mt-20">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
                    <img src={profileData.profileImage || dp} alt="profile" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6 md:mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{`${profileData.firstName} ${profileData.lastName}`}</h1>
                  <p className="text-gray-600 mt-1">{profileData.headline || "Add a headline to showcase yourself"}</p>
                  <p className="text-gray-500 text-sm mt-1">{profileData.location}</p>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <IoIosPeople className="w-4 h-4 mr-1" />
                    <span>{`${profileData.connection?.length || 0} connections`}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 md:mt-0">
                {profileData._id === userData._id ? (
                  <button
                    className="px-4 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] font-medium flex items-center gap-2 hover:bg-[#eef6ff] transition-colors"
                    onClick={() => setEdit(true)}
                  >
                    <HiPencil className="w-4 h-4" /> 
                    <span>Edit profile</span>
                  </button>
                ) : (
                  <ConnectionButton userId={profileData._id} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About & Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* Posts Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-100">Activity</h2>
              <h3 className="text-lg font-medium text-gray-800 mb-4">{`Posts (${profilePost.length})`}</h3>
              
              {profilePost.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts yet</p>
                  {profileData._id === userData._id && (
                    <p className="text-sm text-gray-400 mt-2">Share your first post to get started</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {profilePost.map((post, index) => (
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
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Skills */}
            {profileData.skills?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#eef6ff] text-[#0a66c2] rounded-full text-sm font-medium hover:bg-[#e0efff] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {profileData._id === userData._id && (
                  <button
                    className="mt-4 text-[#0a66c2] text-sm font-medium hover:underline"
                    onClick={() => setEdit(true)}
                  >
                    + Add skills
                  </button>
                )}
              </div>
            )}

            {/* Education */}
            {profileData.education?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                  <FaGraduationCap className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {profileData.education.map((edu, i) => (
                    <div key={i} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-gray-900">{edu.college}</h3>
                      <p className="text-sm text-gray-600">{edu.degree}</p>
                      <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>
                    </div>
                  ))}
                </div>
                
                {profileData._id === userData._id && (
                  <button
                    className="mt-4 text-[#0a66c2] text-sm font-medium hover:underline"
                    onClick={() => setEdit(true)}
                  >
                    + Add education
                  </button>
                )}
              </div>
            )}

            {/* Experience */}
            {profileData.experience?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
                  <FaBriefcase className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {profileData.experience.map((ex, i) => (
                    <div key={i} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-gray-900">{ex.title}</h3>
                      <p className="text-sm text-gray-600">{ex.company}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{ex.description}</p>
                    </div>
                  ))}
                </div>
                
                {profileData._id === userData._id && (
                  <button
                    className="mt-4 text-[#0a66c2] text-sm font-medium hover:underline"
                    onClick={() => setEdit(true)}
                  >
                    + Add experience
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile