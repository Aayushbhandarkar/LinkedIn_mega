import React, { useState, useContext } from "react";
import axios from "axios";
import { useChat } from "../context/ChatContext";
import { authDataContext } from "../context/AuthContext";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { setSelectedUser } = useChat();
  const { serverUrl } = useContext(authDataContext); // ✅ use correct server URL

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      try {
        const res = await axios.get(
          `${serverUrl}/api/user/search?name=${value}`, // ✅ full URL
          { withCredentials: true }
        );
        setResults(res.data.users || []); // ✅ safe fallback
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="p-3">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search users..."
        className="w-full p-2 border rounded"
      />

      {results.length > 0 && (
        <ul className="mt-2 border rounded bg-white shadow">
          {results.map((user) => (
            <li
              key={user._id}
              onClick={() => setSelectedUser(user)} // select for chat
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {user.firstName} {user.lastName} ({user.userName})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
