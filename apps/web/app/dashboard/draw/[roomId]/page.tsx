import  DrawingArea  from "@/components/drawingArea";
import { auth } from "@repo/auth/betterAuth";
import { prisma } from "@repo/db/prisma";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    roomId: string
  }>
}

const Page = async ({
  params
}: Props) => {
  const user = await auth.api.getSession({
    headers: await headers()
  })
  const { roomId } = await params

  const roomDetails = await prisma.room.findUnique({
    where: {
      id: roomId,
      adminId: user?.user.id
    }
  })
  return (
    <>
    <DrawingArea />
    </>

  )
}

export default Page
