import React, { useState } from "react";
import axios from "axios";
import { useChat } from "../context/ChatContext";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { setSelectedUser } = useChat();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      try {
        const res = await axios.get(`/api/user/search?name=${value}`, {
          withCredentials: true,
        });
        setResults(res.data.users); // assume backend returns { users: [...] }
      } catch (err) {
        console.log(err);
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
              {user.name} ({user.userName})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
