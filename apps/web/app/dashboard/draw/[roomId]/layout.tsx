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


  const { socket , isConnected} = useContext(SocketContext)


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
      socket?.send(JSON.stringify(message))
      setMessage(prev => ({
        ...prev,
        payload: {
          message: ""
      }
      }));
    }
  
  useEffect(() => {
  if (!socket || !isConnected) return;
  socket.send(JSON.stringify({
    "type": "join_room",
    "roomId": room,
    "payload": { message: "" }
  }))}, [isConnected]);

  
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
