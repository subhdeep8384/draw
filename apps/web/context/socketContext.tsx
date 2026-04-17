import { createContext, useContext } from "react";
type SocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
};
export const SocketContext = createContext<SocketContextType>({
    socket : null ,
    isConnected : false
})
export const useSocket = () =>{
    return useContext(SocketContext)
}
