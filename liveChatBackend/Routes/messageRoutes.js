import express from "express"
import {selectedUserMessage, availableUser, messageSendingController, markMessageAsSeen} from "../Controllers/messageController.js"
import authMiddleware from "../MiddleWare/authMiddleware.js"


const MessageRouter = express.Router();

MessageRouter.get("/messages", authMiddleware,availableUser)
MessageRouter.get("/:id",authMiddleware,selectedUserMessage)
MessageRouter.put("/mark/:id", authMiddleware, markMessageAsSeen)
MessageRouter.post("/send/:id", authMiddleware, messageSendingController)

export default MessageRouter;