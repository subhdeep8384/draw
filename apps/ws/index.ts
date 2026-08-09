import { WebSocketServer, WebSocket } from "ws";
import { auth } from "@repo/auth/betterAuth";
import { prisma } from "@repo/db/prisma";
import { createRedisClient } from "./redisClient/redis";


const { pub, sub } = await createRedisClient();

const wss = new WebSocketServer({ port: 5000 });

const userSockets = new Map<string, Set<WebSocket>>();
const roomSockets = new Map<string, Set<string>>();




const processedMessages = new Set<string>();

await sub.pSubscribe("room:*", async (message, channel) => {
  try {
    const data = JSON.parse(message);
    const roomId = channel.split(":")[1];
    const users = roomSockets.get(roomId || "");
    if (!users) return;
    users.forEach((user) => {

      const sockets = userSockets.get(user);
      if (!sockets) return;
      
      sockets.forEach((w) => {
          if(user !== data.userId){
            w.send(JSON.stringify(data));
          } 
      });

    });

  } catch (err) {
    console.error("Redis error:", err);
  }
});

wss.on("connection", async (ws, req) => {
  try {
    // const cookie = req.headers.cookie;
    // console.log("the cookie is " ,cookie)
    // if (!cookie) return ws.close();

    // const session = await auth.api.getSession({
    //   headers: { cookie },
    // });
    // console.log("the session is", session)
    // if (!session) return ws.close();

    // const userId = session.user.id;

    // if (!userSockets.has(userId)) {
    //   userSockets.set(userId, new Set());
    // }
    // userSockets.get(userId)!.add(ws);
    let userId : string | null  = null  ;
    ws.send(JSON.stringify({ type: "connected" }));

    ws.on("message", async (raw) => {
      const data = JSON.parse(raw.toString());
      console.log("the data is " ,data)
      const { type, roomId, payload } = data;
      const room = await prisma.room.findUnique({ where: { id: roomId } });

      if(type == "set_user"){
        const user = payload.message.id ;
        console.log("user id is " , user)
        userId = user ;
         if (!userSockets.has(userId!)) {
            userSockets.set(userId!, new Set());
          }
        userSockets.get(userId!)!.add(ws);
        ws.send(JSON.stringify({
          type : "user_set"
        }))

        console.log("user done" , userId )
      }

      if(type == "preview"){
        const event = {
          type: "preview",
          roomId,
          payload,
          userId,
        };
        await pub.publish(`room:${roomId}`, JSON.stringify(event));
      }

      if (type === "join_room") {
        if (!room) return;  
        if (!roomSockets.has(roomId)) {
          roomSockets.set(roomId, new Set());
        }
        if( userId ){
          roomSockets.get(roomId)!.add(userId);
          ws.send(JSON.stringify({ type: "joined_room", roomId }));
          return;
        }
      }

      if (type === "chat") {

        // STORING CHATS REMOVED
        
        // const chat = await prisma.chat.create({
        //   data: {
        //     message: payload.message,
        //     userId,
        //     roomId,
        //   },
        // });

        const id = Math.random() * 9 ;

        const event = {
          id: id,
          type: "chat",
          roomId,
          payload,
          userId,
          timestamp: Date.now(),
        };
        await pub.publish(`room:${roomId}`, JSON.stringify(event));
      }

      if(type === "viewport"){
        console.log(payload)
        const event = {
          type: "viewport",
          roomId,
          payload,
          userId,
        };
        await pub.publish(`room:${roomId}`, JSON.stringify(event));
      }
      
      if(type === "draw"){
        if(!room) return ;
        const event = {
          type: "draw",
          roomId,
          payload
        };
        await pub.publish(`room:${roomId}`, JSON.stringify(event));
      }

       if(type === "selection"){
        if(!room) return ;
        const event = {
          type: "selection",
          roomId,
          payload
        };
        await pub.publish(`room:${roomId}`, JSON.stringify(event));
      }
    });

    

    ws.on("close", () => {
      const sockets = userSockets.get(userId!);
      if (sockets) {
        sockets.delete(ws);
        if (sockets.size === 0) userSockets.delete(userId!);
      }

      roomSockets.forEach((users) => users.delete(userId!));
    });

  } catch (err) {
    ws.close();
  }
});