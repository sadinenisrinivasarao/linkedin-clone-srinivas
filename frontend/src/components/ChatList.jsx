import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const ChatList = ({ onSelectChat }) => {
  const { data: chats = [], isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/chat");
      return res.data;
    },
  });

  if (isLoading) return <div>Loading chats...</div>;

  return (
    <ul>
      {chats.map((chat) => (
        <li key={chat.id} onClick={() => onSelectChat(chat.id)}>
          Chat with {chat.participants[1]?.name}
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
