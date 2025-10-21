import "dotenv/config"
import mongoose from "mongoose"


const mongodb_uri = process.env.MONGODB_URI;

const  connectDB = async ()=> {
    try {
        
        mongoose.connection.on("connected", ()=>{
            console.log("database connected")
        })
        await mongoose.connect(`${mongodb_uri}/chat-app`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB
