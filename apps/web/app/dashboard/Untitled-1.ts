"use client";
import React, { useEffect, useState } from 'react'
import {authClient} from "../../lib/authClient"

import { useRouter } from 'next/navigation';
import { getRooms } from '@/actions/getRooms';
import axios from 'axios';





const Page = () => {
  const [rooms  , setRoom ] = useState<{
    id : string ,
    name : string ,
    createdAt : string ,
    updatedAt : string ,
    adminId : string ,
  }[]>([])


  const router = useRouter() ;
  const [session, setSession] = useState<{
    "email" : string,
    "id" : string,
    "name" : string
}>({
    email : "",
    id : "",
    name : ""
})
useEffect(() =>{
  const fetchSession = async () => {
      const res = await authClient.getSession()
      setSession({
          email : res.data?.user.email || "" ,
          id : res.data?.user.id || "", 
          name : res.data?.user.name || "" 
      })
      if(!res.data?.user.id){
        router.push("/")
      }
    }
  
    const getRooms = async ()=>{
      const res = await axios.get("http://localhost:3005/api/room/allRooms" , {
        withCredentials : true
      })
      setRoom(res.data)
    }
    fetchSession()
    getRooms()
} , [] )

  return (
    <div>
      {rooms.map((room ) => {
        return (<div key={room.id}>{room.name}</div>)
      })}
    </div>
  )
}

export default Page
