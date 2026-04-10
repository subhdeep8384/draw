import { auth } from "@repo/auth/betterAuth";
import { createAuthMiddleware } from "better-auth/api";
import type { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../middleware/authmiddleware";
import {  roomCreate } from "../controller/roomController";
import { roomJoin } from "../controller/roomJoin";
import { getRooms } from "../controller/getRooms";
import { deleteRoom } from "../controller/deleteRoom";

export  const roomRouter = Router();

roomRouter.post("/create" , authMiddleware  , roomCreate);
roomRouter.get("/allRooms" , authMiddleware , getRooms)
roomRouter.post("/delete/:roomId" , authMiddleware , deleteRoom)