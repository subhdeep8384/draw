import {auth} from "auth/betterAuth"
import {WebSocketServer} from "ws"
import {prisma} from "@repo/db/prisma"
const wss = new WebSocketServer({
    port : 5000
})
// const session = await auth.api.getSession({
//     headers: {
//       cookie: `better-auth.session_token=UciqUGzqIHFaLfH9DNabQqEjaX3AsjGi.ONtGQaGGx405VACNA2LhOCq%2B3qcG3uaUj1pP5v1Aoqs%3D`
//     }
//})


wss.on("connection", async (ws, req) => {
    const cookie = req.headers.cookie; 

    const session = await auth.api.getSession({
        headers: { cookie }
    });

    if (!session) {
        ws.send(JSON.stringify({ error: "Unauthorized" }));
        ws.close();
        return;
    }

    ws.send(JSON.stringify({ message: "Connected", user: session.user }));

    ws.on("message", (message) => {
        console.log("Received:", message);
    });
});