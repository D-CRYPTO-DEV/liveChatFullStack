import express from "express"
import { authenticationController, CreateAccController, loginController, updateProfileController } from "../Controllers/mainController.js";
import authMiddleWare from "../MiddleWare/authMiddleware.js";


const useRouter = express.Router();

useRouter.post("/signup",CreateAccController)
useRouter.post("/login",loginController)
useRouter.get("/auth", authMiddleWare,authenticationController)
useRouter.put("/update_profile",authMiddleWare, updateProfileController)

export default useRouter;