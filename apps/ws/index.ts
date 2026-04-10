import { WebSocketServer, WebSocket } from "ws";
import { auth } from "@repo/auth/betterAuth";
import { prisma } from "@repo/db/prisma";
import { createRedisClient } from "./redisClient/redis";

const { pub, sub } = await createRedisClient();

const wss = new WebSocketServer({ port: 5000 });

const userSockets = new Map<string, Set<WebSocket>>();
const roomSockets = new Map<string, Set<string>>();

function getBetterAuthCookie(cookie: string | undefined) {
  if (!cookie) return null;
  const match = cookie.match(/better-auth\.session_token=([^;]+)/);
  return match ? match[0] : null;
}


const processedMessages = new Set<string>();

await sub.pSubscribe("room:*", async (message, channel) => {
  try {

    const data = JSON.parse(message);

    const roomId = channel.split(":")[1];
    const users = roomSockets.get(roomId || "");
    if (!users) return;

    users.forEach((user) => {

      if (user !== data.userId) return;

      const sockets = userSockets.get(user);
      if (!sockets) return;

      sockets.forEach((w) => {
        w.send(JSON.stringify(data));
      });
    });

  } catch (err) {
    console.error("Redis error:", err);
  }
});

wss.on("connection", async (ws, req) => {
  try {
    const cookie = getBetterAuthCookie(req.headers.cookie);
    if (!cookie) return ws.close();

    const session = await auth.api.getSession({
      headers: { cookie },
    });

    if (!session) return ws.close();

    const userId = session.user.id;

    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId)!.add(ws);

    ws.send(JSON.stringify({ type: "connected" }));

    ws.on("message", async (raw) => {
      const data = JSON.parse(raw.toString());
      const { type, roomId, payload } = data;

      if (type === "join_room") {
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) return;  
        if (!roomSockets.has(roomId)) {
          roomSockets.set(roomId, new Set());
        }
        roomSockets.get(roomId)!.add(userId);
        ws.send(JSON.stringify({ type: "joined_room", roomId }));
        return;
      }

      if (type === "chat") {
        const chat = await prisma.chat.create({
          data: {
            message: payload.message,
            userId,
            roomId,
          },
        });

        const event = {
          id: chat.id,
          type: "chat",
          roomId,
          payload,
          userId,
          timestamp: Date.now(),
        };
        await pub.publish(`room:${roomId}`, JSON.stringify(event));
      }
    });

    ws.on("close", () => {
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(ws);
        if (sockets.size === 0) userSockets.delete(userId);
      }

      roomSockets.forEach((users) => users.delete(userId));
    });

  } catch (err) {
    ws.close();
  }
});