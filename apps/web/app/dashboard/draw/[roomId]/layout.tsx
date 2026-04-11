"use client"
import React, { useEffect, useRef, useState } from 'react'
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



const Layout = ({children} : {
    children : React.ReactNode
}) => {
    const params = useParams();
    const roomId = params.roomId;
  
    const [socket , setSocket] = useState<WebSocket | null >(null)
     const socketRef = useRef<WebSocket | null>(null)
  
    useEffect(() =>{
      if(socketRef.current){
        return 
      }
      const ws = new WebSocket("ws://localhost:5000");
      ws.onopen = () =>{
              console.log("connected");
              setSocket(ws);
              socketRef.current = ws;
      }
    } , [])
  
  return (
    <SocketProvider>
          <SidebarProvider>
              <AppSidebar />
                  <main>
                    <SidebarTrigger 
                      className='text-3xl z-50 absolute'
                      />
                    {children}
                  </main>
        </SidebarProvider>
    </SocketProvider>
    
  )
}


export function AppSidebar() {
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
            <Input placeholder="Message.." />
            <Button>Send</Button>
        </SidebarFooter>
      </Sidebar>
    )
  }
export default Layout
