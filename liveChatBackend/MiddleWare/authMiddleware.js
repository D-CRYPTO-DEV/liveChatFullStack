import jwt from "jsonwebtoken"
import appUser from "../model/chatAppModel.js";

const authMiddleWare = async(req, res, next) => {
    try {
        const token = req.headers.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing"
            });
        }

        // jwt.verify returns an object with the decoded payload
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        // Use decoded.userId instead of userId directly
        const user = await appUser.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Add decoded user to request
        req.user = user;
        console.log("middleware is running")
        next();

    } catch (error) {
        console.log("Auth Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

export default authMiddleWare;