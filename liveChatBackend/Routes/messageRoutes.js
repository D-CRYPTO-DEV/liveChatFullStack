import express from "express"
import {selectedUserMessage, 
    availableUser,
    availableGroups,
    messageSendingController,
    markGroupMessageAsSeen,
    selectedgroupMessage,
    markMessageAsSeen,
    sendGroupMessageController
    } from "../Controllers/messageController.js"
import authMiddleware from "../MiddleWare/authMiddleware.js"


const MessageRouter = express.Router();

MessageRouter.get("/messages", authMiddleware,availableUser)
MessageRouter.get("/groups-messages", authMiddleware,availableGroups)

MessageRouter.get("/:id",authMiddleware,selectedUserMessage)
MessageRouter.put("/mark/:id", authMiddleware, markMessageAsSeen)
MessageRouter.post("/send/:id", authMiddleware, messageSendingController)
MessageRouter.post("/send-group/:groupid", authMiddleware, sendGroupMessageController)
MessageRouter.post("/send/:groupid", authMiddleware, sendGroupMessageController)
MessageRouter.get("/group-message/:groupid",authMiddleware,selectedgroupMessage)
MessageRouter.put("/mark/group/:_id", authMiddleware, markGroupMessageAsSeen)

export default MessageRouter;