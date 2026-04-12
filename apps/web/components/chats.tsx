"use client";

import { useParams } from 'next/navigation';

import { Card, CardContent } from "@/components/ui/card";
import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '@/context/socketContext';
import { ChatContext } from '@/context/chatContext';



const Chats = () => {
    const params = useParams();
    const roomId = params.roomId;
    const socket = useContext(SocketContext)
    const { chats, setChats } = useContext(ChatContext)
    const bottomRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        if (!socket) return;
        const joinRoom = () => {
            socket.send(JSON.stringify({ type: "join_room", roomId }));
        };

        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);

            if (socket.readyState === WebSocket.OPEN) {
                joinRoom();
            }

            if (data.type === "chat") {
                setChats((prev) => [...prev, data]);
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket, roomId, setChats]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats]);

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
            <div ref={bottomRef} />
        </div>
    );
};

export default Chats;