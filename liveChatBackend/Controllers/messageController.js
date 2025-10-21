// get add users except the account owner

import cloudinary from "../config/cloudinaryConfig.js";
import appUser from "../model/chatAppModel.js"
import Messages from "../model/messageModel.js"
import { io, userSocketMap } from "../server.js";

export const availableUser = async(req,res)=>{
    try{
    const loggedinUser = req.user._id;
   

    const sidebarUsers = await appUser.find({_id: {$ne: loggedinUser}}).select("-password")
    // number of unseen messages


    const unseenMessages = {}

    const promises = sidebarUsers.map(async(user)=>{
        const messages = await Messages.find({
            senderId:user._id, receiverId:loggedinUser, seen:false
        })

        if(messages.length > 0){
            unseenMessages[user._id] = messages.length
        }
    })
    await Promise.all(promises)

    return res.json({
        success:true,
        users:sidebarUsers,
        unseenMessages
    })

    }catch(e){
        console.log(e.message)
        res.json({
            success:false,
            message:"failed in getting unseen messages"
        })
    }
    
}

// messages from selected user
 export const selectedUserMessage = async(req,res) =>{
    try {
    const selectedUser = req.params.id;
    const userId = req.user._id;

    const messages = await Messages.find({
        $or : [
            {senderId:userId, receiverId:selectedUser},
            {senderId:selectedUser, receiverId:userId},
        ] 
      
    })

    await Messages.updateMany({senderId:selectedUser,receiverId:userId},{seen:true})

    res.json({
        success:true,
        messages
    })
    } catch (error) {
        console.log(error.Message)
        res.json({
            success:false,
            message:"failed in getting messages from the selected user"
        })
    }
    
 }

 // for marking individual unseen message as true

 export const markMessageAsSeen = async(req,res)=>{
    try {
        const {id} = req.params
        await Messages.findByIdAndUpdate(id,{seen:true})
        res.json({
            success:true
        })
    } catch (error) {
         res.json({
            success:false,
            message:"message has been marked as seen"
        })
    }
 }



 // send message

 export const messageSendingController = async(req,res) => {
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;


          // Debug log to check params
        console.log('Request params:', req.params);
        console.log('Receiver ID:', receiverId);
        
        // Validate receiverId
        if(!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required"
            });
        }

         // Extract text content if it's an object
        const messageText = typeof text === 'object' ? text.text : text;

        if(!text && !image) {
            return res.status(400).json({
                success: false,
                message: "Message content is required"
            });
        }

        let imageUri;
        if(image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUri = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Image upload error:", uploadError);
                return res.status(400).json({
                    success: false,
                    message: "Failed to upload image"
                });
            }
        }

        const newMessage = await Messages.create({
            senderId,
            receiverId,
            text:messageText,
            image: imageUri
        });

        // emit message to receiver
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({
            success: true, 
            message: newMessage
        });

    } catch (error) {
        console.error("Message sending error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
}