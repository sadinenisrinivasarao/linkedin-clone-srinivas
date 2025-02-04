import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  // Query to get current authenticated user
  const { data: currentUser } = useQuery({ queryKey: ["authUser"] });

  // Mutation to create a new chat
  const newChatMutation = useMutation({
    mutationFn: (chatData) => axiosInstance.post("/chat", chatData),
    onSuccess: (response) => {
      // console.log("Chat created successfully:", response.data);
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
    },
  });

  // Query to fetch connections
  const { data: connectionsResponse, isLoading, error } = useQuery({
    queryKey: ["connections"],
    queryFn: () => axiosInstance.get("/connections"),
  });

  if (isLoading) return <p>Loading connections...</p>;
  if (error) return <p>Failed to load connections.</p>;

  const connections = connectionsResponse?.data || [];

  // Function to handle chat creation
  const handleCreateChat = (chatId) => {
    if (!message || !selectedUser) {
      alert("Please select a user and enter a message.");
      return;
    }
    setSelectedUser(chatId);
    const chatData = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      message,
    };

    // Call mutation to create the chat
    newChatMutation.mutate(chatData);
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 text-white p-6 flex flex-col">
        <h3 className="text-2xl mb-4">Connections</h3>
        <ul>
          {connections.length > 0 &&
            connections.map((user) => (
              <li
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 
                  ${selectedUser?._id === user._id ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}
              >
                <div className="flex items-center space-x-4">
                  {/* User's Avatar */}
                  <img
                    src={user.profilePicture || "/avatar.png"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* Chat Container */}
      <div className="flex-1 p-8 bg-white">
        {/* Message Area */}
        {!selectedUser ? (
          <div className="text-center text-lg text-gray-600">
            <p>Select a connection to start chatting</p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl mb-4 text-gray-800">Chat with {selectedUser.name}</h2>

            <input
              type="text"
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg mb-6 text-lg focus:outline-none "
            />
            <button
              onClick={handleCreateChat}
              className="w-full py-3 bg-primary text-white rounded-lg text-lg hover:bg-primary-dark transition-all"
            >
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
