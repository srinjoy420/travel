import {Router} from "express";
import { getMe, loginUser, logoutUser, registerUser, updateProfile } from "../controller/Auth.controller.js";
import { isLoggedin } from "../middleware/auth.middleware.js";

const UserRouter=Router();
UserRouter.post("/singup",registerUser)
UserRouter.post("/login",loginUser)
UserRouter.get("/logout",isLoggedin,logoutUser)
UserRouter.get("/about",isLoggedin,getMe)
UserRouter.put("/update-profile",isLoggedin,updateProfile)

export default UserRouter