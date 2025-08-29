import { Router } from "express";
import { addUser, getAllUsers, loginUser } from "../controller/controller.js";

const userRouter = Router();

userRouter.get('/get', getAllUsers);
userRouter.post('/post', addUser);
userRouter.post('/login', loginUser)
export default userRouter;