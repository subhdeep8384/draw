import { ChatContext } from "@/context/chatContext";
import { useState } from "react";

interface ChatType {
  id: string;
  type: string;
  roomId: string;
  payload: {
    message: string;
  };
  userId: string;
  timestamp: number;
}

type ChatContextType = {
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<ChatType[]>([]);

  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
}