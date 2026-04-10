"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "../../lib/authClient"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { CreateRoomForm } from "@/components/createRoomForm";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
const DashBoard = () => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false)
  const [newRoomFormOpen, setNewRoomFormOpen] = useState(false)
  const [rooms, setRoom] = useState<{
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    adminId: string,
    users: {
      id: string,
      name: string
    }[]
  }[]>([])
  const [, setSession] = useState<{
    "email": string,
    "id": string,
    "name": string
  }>({
    email: "",
    id: "",
    name: ""
  })

  useEffect(() => {
    const getRooms = async () => {
      const res = await axios.get("http://localhost:3005/api/room/allRooms", {
        withCredentials: true
      });
      setRoom(res.data);
    };

    getRooms();

  }, [refresh])

  useEffect(() => {
    const fetchSession = async () => {
      const res = await authClient.getSession()
      setSession({
        email: res.data?.user.email || "",
        id: res.data?.user.id || "",
        name: res.data?.user.name || ""
      })
      if (!res.data?.user.id) {
        router.push("/")
      }
    }

    const getRooms = async () => {
      const res = await axios.get("http://localhost:3005/api/room/allRooms", {
        withCredentials: true
      })
      setRoom(res.data)
    }
    fetchSession()
    getRooms()
  }, [])

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <CreateRoomForm
        formOpen={newRoomFormOpen}
        setFormOpen={setNewRoomFormOpen}
        setRefresh={setRefresh}
      />

      <div className="mb-8 flex w-full justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Rooms</h1>
          <p className="text-muted-foreground">
            Manage and access your collaborative rooms
          </p>
        </div>

        <div>
          <Button className="px-12 py-4"
            onClick={() => setNewRoomFormOpen(t => !t)}
          >
            create room
          </Button>
        </div>
      </div>


      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="text-lg">{room.name}</CardTitle>
              <CardDescription>
                {room.users.length} members
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {room.users?.map((user) => (
                  <span
                    key={user.id}
                    className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {user.name}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button className="flex-1"
                onClick={() => router.push(`/dashboard/draw/${room.id}`)}
              >
                Enter
              </Button>
              <Button
              disabled={loadingId === room.id}
                onClick={async () => {
                  try {
                    setLoadingId(room.id);
                    console.log(room.id)
                    await axios.post(`http://localhost:3005/api/room/delete/${room.id}`, {}, {
                      withCredentials: true
                    })
                    toast.success("Room deleted successfully")
                    setRefresh((e) => !e)
                  } catch (e) {
          
                   } finally { setLoadingId(null); }
                }}
                variant="destructive" className="flex-1">
                {loadingId === room.id ? (
                  <Spinner className="size-4" />
                ) : (
                  "Delete"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <p className="text-lg font-medium">No rooms found</p>
          <p className="text-muted-foreground text-sm">
            Create your first room to get started
          </p>
        </div>
      )}

    </div>
  )
}

export default DashBoard