import express from "express";
const userRouter = express();

import { userAuth } from "../middleware/verifyAuth";
import { UserController } from "../controllers/userController";
const userController = new UserController();


userRouter.get('/home',userAuth,userController.home);
userRouter.post('/register',userController.register);
userRouter.post('/login',userController.login);
userRouter.post('/logout',userController.logout);


export default userRouter;
