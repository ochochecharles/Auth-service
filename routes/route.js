import { Router } from "express";
import { addUser, getAllUsers, loginUser, protectedAPI, userDashboard } from "../controller/controller.js";

const userRouter = Router();

userRouter.get('/get', getAllUsers);
userRouter.post('/post', addUser);
userRouter.post('/login', loginUser)
userRouter.get('/dashboard', protectedAPI, userDashboard)
export default userRouter;