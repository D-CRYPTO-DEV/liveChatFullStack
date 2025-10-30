// get add users except the account owner

import cloudinary from "../config/cloudinaryConfig.js";
import appUser from "../model/chatAppModel.js"
import groupMessages from "../model/groupMessages.js";
import GroupChat from "../model/groupsModel.js";
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


export const availableGroups = async(req,res)=>{
    try{
    const loggedinUser = req.user._id;
   

    const sidebarGroups = await GroupChat.find({groupMembers: loggedinUser});
    //senders that are not me
   
    const unseenGroupMessages = {
       
    }

   const promises = sidebarGroups.map(async(group) => {
    
    // Step 3: Query for unseen messages for THIS group and THIS loggedinUser
    const unseenCount = await groupMessages.countDocuments({
        // Filter by the current group's ID
        groupId: group._id, 
        // Filter by the logged-in user and that user's 'seen' status is false
        "receiversId": {
             $elemMatch: {
                groupMember: loggedinUser,
                seen: false
            }
        }
    });

    if(unseenCount > 0){
        // Step 4: Store the count using the Group ID as the key
        unseenGroupMessages[group._id] = unseenCount;
    }
    });
    await Promise.all(promises)

    return res.json({
        success:true,
        groups:sidebarGroups,
       unseenGroupMessages
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


 // messages from selected groups
 export const selectedgroupMessage = async(req,res) =>{
    try {
        const selectedgroup = req.params.groupid;
        const userId = req.user._id;

        console.log('Checking group messages for:', { selectedgroup, userId });

        const isMember = await GroupChat.findOne({ 
            _id: selectedgroup, 
            groupMembers: userId 
        });

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group"
            });
        }

        const messages = await groupMessages.find({ 
            groupId: selectedgroup   
        })
        console.log('Found group messages:', messages);

        // Update seen status for this user's messages
        await groupMessages.updateMany(
            {
                groupId: selectedgroup,
                'receiversId.groupMember': userId,
                'receiversId.seen': false
            },
            {
                $set: {
                    'receiversId.$.seen': true,
                    'receiversId.$.readAt': new Date()
                }
            }
        );

        res.json({
            success: true,
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
            io.to(receiverSocketId).emit("privateMessage", newMessage);
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


// send message to group chat

 export const sendGroupMessageController = async(req,res) => {
    try {
        const {text, image} = req.body;
        const groupId = req.params.groupid;
        const senderId = req.user._id;


          // Debug log to check params
        console.log('Request params:', req.params);
        console.log('Group ID:', groupId);
        
        // Validate receiverId
        if(!groupId) {
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

        const group = await GroupChat.findById(groupId);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group chat not found"
            });
        }

        // Check if sender is a member of the group
        if (!group.groupMembers.includes(senderId)) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group"
            });
        }

        console.log('Creating group message with:', {
            groupMembers: group.groupMembers,
            senderId,
            messageText
        });

        const newMessage = await groupMessages.create({
            receiversId: group.groupMembers.map(member => ({
                groupMember: member,
                seen: member.toString().toLowerCase() === senderId.toString().toLowerCase(),
                readAt: member.toString() === senderId.toString() ? new Date() : null
            })),
            senderId,
            groupId,
            text: messageText,
            image: imageUri
        });

        // emit message to receiver
       
        io.to(groupId).emit("groupMessage", newMessage);
       

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

// for marking group unseen message as true

 export const markGroupMessageAsSeen = async(req,res)=>{
    try {
        const {id} = req.params
        const userId = req.user._id
        await groupMessages.findByIdAndUpdate(id,
            {
                // **Update:** Set the 'seen' and 'readAt' properties for the matching array element.
                // The path is now 'receiversId.$[elem].seen' (no '.member')
                'receiversId.$[elem].seen': true,
                'receiversId.$[elem].readAt': new Date(),
            },
            {
                // Define the array filter to find the element whose
                // 'groupMember' field matches the current userId.
                arrayFilters: [{ 'elem.groupMember': userId }],
                new: true, // Return the updated document
            }
        )
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