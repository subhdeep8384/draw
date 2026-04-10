"use server";

import axios from "axios";


export async function getAllChats(roomId: string) {
  const res = await axios.get(
    `http://localhost:3005/api/chats/${roomId}`,
    {
      withCredentials: true,
    }
  );
  console.log(res)
  return res.data; 
}