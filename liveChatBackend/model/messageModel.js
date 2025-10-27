import mongoose from "mongoose";


const MessagesSchema = new mongoose.Schema({
   senderId:{type:mongoose.Schema.Types.ObjectId,ref: "appUser", required:true},
   receiverId:{type:mongoose.Schema.Types.ObjectId,ref: "appUser",required:true},
   text:{type:String},
   image:{type:String},
   seen:{type:Boolean, default:false}
},{timestamps:true})


const Messages = mongoose.model("Messages", MessagesSchema);

export default Messages;