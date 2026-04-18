"use client";

import { useParams } from 'next/navigation';

import { Card, CardContent } from "@/components/ui/card";
import { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '@/context/chatContext';



const Chats = ( ) => {
    const { chats, setChats } = useContext(ChatContext)
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats]);

    return (
        <div>
            {chats.length === 0 && <p>No chats yet</p>}
            {chats.map((chat) => (
                <Card className="p-2 m-3" key={chat.id ?? Math.random()}>
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