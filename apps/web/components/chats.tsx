"use client";

import { useParams } from 'next/navigation';

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from 'react';


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
const Chats = () => {
    const [chats, setChats] = useState<ChatType[]>([]);
    const params = useParams();
    const roomId = params.roomId;

    const [socket , setSocket] = useState<WebSocket |null >(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if(!socketRef.current) {  
            return
        };

        socketRef.current.onmessage = (event )=>{
            const data = JSON.parse(event.data);
            if(data.type === "connected"){
                socketRef.current?.send(JSON.stringify({type: "join_room", roomId}));
            }


            if(data.type === "chat"){
                console.log("chat data" , data);
                setChats((prev ) => [...prev, data]);
            }
        }
    } , [socket , socketRef , roomId]);


   

    return (
        <div>
            {chats.length === 0 && <p>No chats yet</p>}

            {chats.map((chat) => (
                <Card className="p-2 m-3" key={chat.id}>
                    <CardContent>
                        <p>{chat.payload.message}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Chats;