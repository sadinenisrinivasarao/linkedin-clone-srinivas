import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { socket } from "../lib/socket";
import { axiosInstance } from "../lib/axios";

const ChatWindow = ({ chatId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch initial messages for the selected chat
  const { data: initialMessages, refetch } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/chat/${chatId}/messages`);
      return res.data;
    },
  });

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    // Join the selected chat room
    socket.emit("join_chat", chatId);

    // Listen for incoming messages
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { chatId, senderId: "User123", content: message };
    
    // Save to DB and emit the message
    await axiosInstance.post(`/chat/${chatId}/messages`, newMessage);
    socket.emit("send_message", newMessage);
    setMessage("");
  };

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.senderId}:</strong> {msg.content}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatWindow;
