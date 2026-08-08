"use client";

import DrawingArea from "@/components/drawingArea";
import { authClient } from "@/lib/authClient";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const [session, setSession] = useState<{
    session: any;
    user: any;
  } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await authClient.getSession();

      console.log("res is", res);

      if (res.data) {
        setSession({
          session: res.data.session,
          user: res.data.user,
        });
      }
    };

    fetchSession();
  }, []);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <DrawingArea
      session={session}
      roomId={roomId}
    />
  );
};

export default Page;