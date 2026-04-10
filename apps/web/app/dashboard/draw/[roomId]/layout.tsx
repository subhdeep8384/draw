import React from 'react'
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
const Layout = ({children} : {
    children : React.ReactNode
}) => {
  return (
    <SidebarProvider>
         <AppSidebar />
    <main>
      <SidebarTrigger 
        className='text-3xl'
       
      />
      {children}
    </main>
  </SidebarProvider>
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
