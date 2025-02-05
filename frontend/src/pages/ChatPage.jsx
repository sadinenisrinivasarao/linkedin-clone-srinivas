import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import ChatWindow from "../components/ChatWindow";

const ChatPage = ({ senderId }) => {
  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axiosInstance.get(`/connections`);
        setConnections(res.data || []);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };
    fetchConnections();
  }, [senderId]);

  // Filter and limit displayed connections
  const filteredConnections = connections
    .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 5);

  return (
    <div className="flex flex-row justify-center items-start p-8 gap-8 bg-gray-100 max-h-[500px]">
      {/* Sidebar for Connections */}
      <div className="w-[30%] bg-primary shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Connections</h2>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search connections..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Connections List */}
        <ul className="space-y-4">
          {filteredConnections.length > 0 ? (
            filteredConnections.map((user) => (
              <li
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`cursor-pointer p-3 transition duration-200 ${
                  selectedUser && selectedUser._id === user._id
                    ? " text-white  ring-offset-2 ring-blue-700 shadow-lg transform scale-105"
                    : "bg-gray-100 hover:bg-blue-400 hover:text-white"
                }`}
              >
                <h4 className="text-lg font-medium">{user.name}</h4>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No connections found.</p>
          )}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="w-[70%]">
        {selectedUser ? (
          <ChatWindow receiverId={selectedUser} senderId={senderId} />
        ) : (
          <div className="flex justify-center items-center">
            <p className="text-gray-500 text-lg">Select a user to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
