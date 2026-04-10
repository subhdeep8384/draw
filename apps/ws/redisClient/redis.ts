import { createTelemetry } from "better-auth";
import {
    createClient ,
} from "redis";
import type { RedisClientType } from "redis";

let pubClient:RedisClientType ;
let subClient:RedisClientType;

export async function createRedisClient() {
    if (!pubClient || !subClient) {
        pubClient = createClient();
        subClient = createClient();

        pubClient.on("error", (err) => console.error("Redis Pub Error:", err));
        subClient.on("error", (err) => console.error("Redis Sub Error:", err));

        await pubClient.connect();
        console.log("pub connected")
        await subClient.connect();
        console.log("sub connected")
    }

    return { pub: pubClient, sub: subClient };
}