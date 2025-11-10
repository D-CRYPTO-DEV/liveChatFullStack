import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"

import connectDB from "./config/mongooseConfig.js";
import useRouter from "./Routes/userRoutes.js";
import MessageRouter from "./Routes/messageRoutes.js";
import { Server } from "socket.io";
import { isGroupMember } from "./config/utils.js";

// create app
const app = express();
const server = http.createServer(app)
    
// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

// store online users
export const userSocketMap = {}; //{userId:socketId}

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected:", userId)

    if(userId) {
        userSocketMap[userId] = socket.id;
    }

    //emit online users to all connected users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('joinGroup', async(groupId) => {
    
    const isMember = await  isGroupMember(groupId, userId);

    if (isMember) {
        // Add the socket to the room named by the group ID
        socket.join(groupId);
        console.log(`Socket ${socket.id} joined room: ${groupId}`);
    }
    });


    socket.on("disconnect", () => {
        console.log("user Disconnected", userId);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})



// connect to mongodb
await connectDB()

// middlewares
app.use(express.json({
    limit: "4mb"
}))
app.use(cors())

// routes setup
app.use("/api/auth", useRouter)
app.use("/api/messages", MessageRouter)

// base route (optional)
app.get("/", (req,res) => res.send("server is running fine"))





if(process.env.NODE_ENV === "production") {
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log("server running at PORT:" + PORT)
})
}


// for development
export default server;