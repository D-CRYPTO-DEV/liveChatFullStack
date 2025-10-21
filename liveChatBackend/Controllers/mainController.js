// user sign up function
import cookieParser from "cookie-parser"
import appUser from "../model/chatAppModel.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../config/utils.js";
import { json } from "express";
import cloudinary from "../config/cloudinaryConfig.js"


export const CreateAccController = async(req,res) => {
    const {fullName, email, password, bio, profilePic} = req.body;
    try {
        // if(!fullName || !email || !password || !bio|| !profilePic){
        //    return res.json({
        //         success:false,
        //         message: `missing details`
        //     })
        // }
        const User = await appUser.findOne({email});
        if(User){
            return res.json({
                success:false,
                message:"user with this email already exists"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password,salt);
        const newUser = await appUser.create({
            email,
            password:hasedPassword,
            bio,
            profilePic,
            fullName
        })
       

        const Token = generateToken(newUser._id)
        return res.json({
            success:true,
            userData: newUser,
            Token,
            message:"user registration successful"
         })
        
    } catch (error) {
        console.log(error.message)
        return res.json({
            success:false,
            message: error.message
         })
    }
}


// Login controller function


export const loginController = async(req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.json({
            success:false,
            message:"invalid login credencials"
        })
    }
    try {
        const User = await appUser.findOne({email});
        if(!User){
            return res.json({
            success:false,
            message:"user not registered, pls register before logging in"
        })
        }

        //password check
        const checkPass = await bcrypt.compare(password, User.password)

        if(checkPass){
            const token = generateToken(User._id)

            return res.json({
            success:true,
            userData: User,
            token,
            message:"user login successful"
         })
        }else{
             return res.json({
            success:false,
            message:"incorrect password"
            })
        }
        }
    catch (error) {
         return res.json({
            success:false,
           
            message:"user login was unsuccessful"
         })
    }

} 


// authentication checking controller 

export const authenticationController = (req,res) =>{
    res.json({
        success:true,
        user:req.user
    })
}


// update profile controller function 

export const updateProfileController = async(req,res) =>{
    try {
        const userId = req.user._id;
        const {fullName, bio, profilePic} = req.body;
        
        if(!userId){
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if(!fullName && !bio && !profilePic){
            return res.status(400).json({
                success: false,
                message: "No updates provided"
            });
        }

        let updateFields = {};

        // Build update object
        if(fullName) updateFields.fullName = fullName;
        if(bio) updateFields.bio = bio;

        // Handle profile picture upload
        if(profilePic) {
            try {
                const uploadResult = await cloudinary.uploader.upload(profilePic, {
                    folder: "profile_pictures",
                    resource_type: "image"
                });
                updateFields.profilePic = uploadResult.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(400).json({
                    success: false,
                    message: "Image upload failed"
                });
            }
        }

        // Single database update
        const updatedUser = await appUser.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        ).select("-password");

        if(!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            userdata: updatedUser,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during update"
        });
    }
}