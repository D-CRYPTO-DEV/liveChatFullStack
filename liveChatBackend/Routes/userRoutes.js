import express from "express"
import { authenticationController, CreateAccController,
            loginController, updateProfileController,createGroupController,
            addMemberToGroupController,removeMemberFromGroupController,
            updateGroupProfileController 
        } from "../Controllers/mainController.js";
import authMiddleWare from "../MiddleWare/authMiddleware.js";


const useRouter = express.Router();

useRouter.post("/signup",CreateAccController)
useRouter.post("/login",loginController)
useRouter.get("/auth", authMiddleWare,authenticationController)
useRouter.put("/update_profile",authMiddleWare, updateProfileController)
useRouter.put("/add-member",authMiddleWare, addMemberToGroupController)
useRouter.post("/create_group",authMiddleWare,createGroupController)
useRouter.put("/remove-member",authMiddleWare, removeMemberFromGroupController)
useRouter.put("/update_groupProfile",authMiddleWare, updateGroupProfileController)



export default useRouter;