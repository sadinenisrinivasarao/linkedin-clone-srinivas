import { useState, useEffect } from "react";
import { socket } from "../lib/socket";
import { axiosInstance } from "../lib/axios";
import axios from "axios";

const ChatWindow = ({ receiverId, senderId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(
          `/messages?senderId=${senderId._id}&receiverId=${receiverId._id}`
        );
        setMessages(res.data || []);
      } catch (error) {
        setError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [receiverId._id, senderId._id]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessageData = {
      senderId: senderId._id,
      receiverId: receiverId._id,
      content: message,
    };

    try {
      const response = await axios.post("/api/v1/messages", newMessageData);
      setMessages((prev) => [...prev, response.data]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    const handleMessage = (newMessage) => {
      if (
        (newMessage.senderId === receiverId._id && newMessage.receiverId === senderId._id) ||
        (newMessage.senderId === senderId._id && newMessage.receiverId === receiverId._id)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("newMessage", handleMessage);
    return () => socket.off("newMessage", handleMessage);
  }, [receiverId._id, senderId._id]);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
      {/* Message List */}
      <div className="flex-grow mb-4 space-y-4 overflow-y-auto max-h-[500px]"> {/* Fixed height here and overflow for scrolling */}
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : messages.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Chat with {receiverId.name}
            </h2>
            <ul className="space-y-3">
              {messages.map((msg, index) => (
                <li key={index} className={`flex ${msg.senderId === senderId._id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg shadow-md text-sm ${msg.senderId === senderId._id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                    {msg.senderId !== senderId._id && (
                      <p className="text-xs text-gray-500 mb-1">{receiverId.name}</p>
                    )}
                    <p>{msg.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        )}
      </div>

      {/* Message Input */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
