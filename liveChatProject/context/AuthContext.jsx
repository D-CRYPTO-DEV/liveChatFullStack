import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"
import {io} from "socket.io-client"


const backend_uri = import.meta.env.VITE_BACKEND_URI;
axios.defaults.baseURL = backend_uri

export const AuthContext = createContext();

export const AuthProvider =({children})=>{
    const [userState, setUserState] = useState("signup")
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)


    const checkAuth = async()=>{
        try {
            const {data} = await axios.get("api/auth/auth");
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    //connect socket section
    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return
        const newSocket = io(backend_uri,{
            query: {
                userId:userData._id
            }
        })
        newSocket.connect();
        setSocket(newSocket)

        newSocket.on("getOnlineUsers", (userids)=>{
            setOnlineUsers(userids);
        })
        
    }
// login function to handle user authentication and socket connection 
    const login = async(userState,credentials)=>{
        try {
            const {data} = await axios.post(`/api/auth/${userState}`,credentials);
            if(data.success){
                setAuthUser(data.userData)
                connectSocket(data.userData)
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token)
                localStorage.setItem("token",data.token)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
        }
    }

    const logout = async() =>{
        try {
            localStorage.removeItem("token");
            setAuthUser(null);
            setToken(null);
            setOnlineUsers([]);
            axios.defaults.headers.common["token"] = null;           
            socket.disconnect();
            toast.success("loggout successful");
        } catch (error) {
            toast.error(error.message)
        }
       
    }

    const updateProfile = async(body) =>{
        try {
            const {data} = await axios.put("/api/auth/update_profile", body);
            if(data.success){
                setAuthUser(data.userdata);
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
       
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token
        }
        checkAuth()
    },[token])

    const value = {
        axios,
        token,
        authUser,
        onlineUsers,
        socket,
        userState,
        login,
        logout,
        updateProfile,
        setUserState
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}