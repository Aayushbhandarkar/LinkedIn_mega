import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthDataContext } from "./AuthContext"; // ✅ Fix import
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserDataContext = createContext(); // ✅ Capitalize

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [postData, setPostData] = useState([]);
  const [profileData, setProfileData] = useState(null); // ✅ Better default
  const { serverUrl } = useContext(AuthDataContext); // ✅ Fix usage
  const navigate = useNavigate();

  // ✅ Fetch current user
  const getCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/currentuser`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      console.error(
        "Error fetching current user:",
        error.response?.data || error.message
      );
      setUserData(null);
    }
  };

  // ✅ Fetch posts
  const getPost = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/getpost`, {
        withCredentials: true,
      });
      setPostData(result.data);
    } catch (error) {
      console.error("Error fetching posts:", error.response?.data || error.message);
    }
  };

  // ✅ Fetch profile data for a user
  const handleGetProfile = async (userName) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/profile/${userName}`,
        { withCredentials: true }
      );
      setProfileData(result.data);
      navigate("/profile");
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!serverUrl) return;
    getCurrentUser();
    getPost();
  }, [serverUrl]); // ✅ include serverUrl

  const value = {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    getPost,
    handleGetProfile,
    profileData,
    setProfileData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
