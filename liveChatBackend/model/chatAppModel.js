import mongoose from "mongoose";


const chatAppUserSchema = new mongoose.Schema({
    email: {type: String, required:true, unique:true},
    fullName: {type: String, required:true},
    profilePic: {type: String},
    password: {type: String, required:true, minLength : 6},
    bio: {type: String, required:true, default:"" }
},{timestamps:true})


const appUser = mongoose.model("appUser",chatAppUserSchema);

export default appUser;