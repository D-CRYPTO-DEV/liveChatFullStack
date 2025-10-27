import mongoose from "mongoose";


const GroupSchema = new mongoose.Schema({
    groupAdmin: {type:mongoose.Schema.Types.ObjectId,ref: "appUser", required:true},
    groupMembers: [{type:mongoose.Schema.Types.ObjectId,ref: "appUser"}],
    groupName: {type: String, required:true},
    group_profilePic: {type: String},
    bio: {type: String, required:true, default:"" }
},{timestamps:true})


const GroupChat = mongoose.model("GroupChat",GroupSchema);

export default GroupChat;