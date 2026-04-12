import { createContext } from "react";

interface ChatType{
    "id": string,
    "type": string,
    "roomId": string,
    "payload": {
        "message": string,
    }
    "userId": string,
    "timestamp": number,
}

type ChatContextType = {
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
};
export const ChatContext = createContext<ChatContextType>({
    chats :[],
    setChats : () => {} 
})

