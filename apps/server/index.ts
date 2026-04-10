import express from 'express'
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "@repo/auth/betterAuth";
import { roomRouter } from './routes/roomRouter';
import { chatRouter } from './routes/chatRouter';
const app = express();
const port = 3005;
app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"], 
      credentials: true, 
    })
  );
app.use(express.json());
app.use("/api/auth", toNodeHandler(auth));
app.get("/api/me", async (req, res) => {
    const session = await auth.api.getSession({
     headers: fromNodeHeaders(req.headers),
   });
   return res.json(session);
});

app.use("/api/room" , roomRouter );
app.use("/api/chats", chatRouter) ;

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});