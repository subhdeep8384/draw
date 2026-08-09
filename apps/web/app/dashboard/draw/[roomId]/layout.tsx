"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Chats from '@/components/chats'
import { useParams } from 'next/navigation'
import { SocketContext } from '@/context/socketContext'
import { SocketProvider } from '@/providers/socketProvider'
import { ChatProvider } from '@/providers/chatProvider'
import { ChatContext } from '@/context/chatContext'
import { toast } from "sonner";
import { authClient } from '@/lib/authClient'




const Layout = ({children} : {
    children : React.ReactNode
}) => {


  return (
    <SocketProvider>
      <ChatProvider>
          <SidebarProvider>
              <AppSidebar />
                  <main>
                    <SidebarTrigger 
                      className='text-3xl z-50 absolute'
                      />
                    {children}
                  </main>
        </SidebarProvider>
      </ChatProvider>
    </SocketProvider>
    
  )
}

export function AppSidebar() {
  const params = useParams();
  const room = params.roomId as string;
  const {chats , setChats} = useContext(ChatContext)
  const { socket , isConnected} = useContext(SocketContext)
  const [session, setSession] = useState<{
      session: any;
      user: any;
    } | null>(null);
  
    useEffect(() => {
      const fetchSession = async () => {
        const res = await authClient.getSession();
  
  
        if (res.data) {
          setSession({
            session: res.data.session,
            user: res.data.user,
          });
        }
      };
  
      fetchSession();
    }, []);
     useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === "chat") {
                toast.info(data.payload.message)
                setChats((prev) => [...prev, data]);
            }
        };
        socket?.addEventListener("message", handleMessage);

        return () => {
            socket?.removeEventListener("message", handleMessage);
        };
    }, [socket]); 


  const [message , setMessage ] = useState<{
    roomId : string,
    type : "chat",
    payload : {
      message : string
    }
  }>({
    roomId : room ,
    type: "chat",
    payload:{
      message : ""
    }
  })

    const sendMessage = () =>{
      setChats((prev ) =>[...prev , message])
      socket?.send(JSON.stringify(message))
      setMessage(prev => ({
        ...prev,
        payload: {
          message: ""
      }
      }));
    }
  
  // useEffect(() => {
  // if (!socket || !isConnected) return;
  // socket.send(JSON.stringify({
  //   "type": "set_user",
  //   "roomId": room,
  //   "payload": { message: session?.user }
  // }))

  // socket.send(JSON.stringify({
  //   "type": "join_room",
  //   "roomId": room,
  //   "payload": { message: "" }
  // }))
  // }, [session]);
  useEffect(() => {
  if (!socket || !isConnected || !session?.user) return;

  socket.send(
    JSON.stringify({
      type: "set_user",
      roomId: room,
      payload: {
        message: session.user,
      },
    })
  );

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    if (data.type === "user_set") {
      console.log("joining room....")
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: room,
          payload: {
            message: "",
          },
        })
      );
    }
  };

  socket.addEventListener("message", handleMessage);

  return () => {
    socket.removeEventListener("message", handleMessage);
  };
}, [ session , room]);

  
    return (


      <Sidebar>
        <SidebarHeader 
            className='text-2xl font-bold flex items-center'
            >
            Chats
        </SidebarHeader>
        <SidebarContent>
          <Chats />
        </SidebarContent>
        <SidebarFooter >
            <Input placeholder="Message.." 
            onKeyDown={(e) =>{
              if(e.key === "Enter"){
                e.preventDefault() ;
                sendMessage()
              }
            }}
            value={message.payload.message}
            onChange={( e ) => 
              setMessage(prev => ({
                ...prev , 
                payload :{
                  message : e.target.value
                }
              }))}
              />
            <Button onClick={sendMessage}>Send</Button>
        </SidebarFooter>
      </Sidebar>

    )
  }
export default Layout
