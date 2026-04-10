import { Router, type Request, type Response } from "express";
import { chatController } from "../controller/chatController";
import { authMiddleware } from "../middleware/authmiddleware";

export const chatRouter =  Router() ;

chatRouter.get("/:roomId", authMiddleware , chatController); 