import jwt from "jsonwebtoken"
import GroupChat from "../model/groupsModel.js";

export const generateToken =  (userId)=>{
    const token = jwt.sign({userId}, process.env.SECRET_KEY);
    return token
}


export const isGroupMember = async(groupId, userId)=>{
    try {
        const group = await GroupChat.findById(groupId)
        if(group){
            return group.groupMembers.includes(userId)
        }
        return false;
        
    } catch (error) {
        return error.message
    }
}