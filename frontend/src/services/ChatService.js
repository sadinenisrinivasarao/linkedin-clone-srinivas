// /src/services/ChatService.js
const getChats = async () => {
    const response = await fetch("/api/v1/chat");
    const data = await response.json();
    return data; // This should return an array of chat objects
  };
  
  const getMessages = async (chatId) => {
    const response = await fetch(`/api/v1/chat/${chatId}/messages`);
    const data = await response.json();
    return data; // This should return an array of messages
  };
  
  export default { getChats, getMessages };
  