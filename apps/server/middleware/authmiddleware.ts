import { auth } from "@repo/auth/betterAuth";
import type { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
      interface Request {
        session?: any;
      }
    }
  }


export async function authMiddleware(req : Request , res : Response, next : NextFunction){
    const cookie = req.headers.cookie ;
    const session = await auth.api.getSession({
        headers : { cookie }
    })

    if(!session){
        res.status(401).json({ error : "Unauthorized" })
        return ;
    }

    req.session = session;
    next() ;
}
