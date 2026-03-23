import express from 'express'
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "../../packages/auth/auth";
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
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});