import { SocketContext } from "@/context/socketContext";
import { useEffect, useRef, useState } from "react";

type SocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    ws.onmessage = (e) =>{
      setIsConnected(true);
    }
    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  };
  }, []);



  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}