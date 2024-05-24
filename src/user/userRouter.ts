import { Router } from "express";
import { createUser } from "./userController";

const userRouter = Router();

// Routes
userRouter.post("/register", createUser);

export default userRouter;
