import mongoose from "mongoose";


const readStatusSchema = new mongoose.Schema({
  groupMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupChat', // Reference to your User model
    required: true
  },
  seen: {
    type: Boolean,
    default: false // Default to false (unread)
  },
  readAt: {
    type: Date // Optional: you can also store *when* they read it
  }
}, { _id: false }); // _id: false prevents Mongoose from adding an _id to each sub-document


const MessagesSchema = new mongoose.Schema({
  groupId:{type:mongoose.Schema.Types.ObjectId,ref: "GroupChat"},
  senderId:{type:mongoose.Schema.Types.ObjectId,ref: "appUser", required:true},
  senderFullName:{type:String, required:true},
  receiversId:[readStatusSchema],
  text:{type:String},
  image:{type:String},
},{timestamps:true})


const groupMessages = mongoose.model("groupMessages", MessagesSchema);

export default groupMessages;