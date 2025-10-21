import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



export const messagesContext = createContext()

export const MessageProvider = ({children})=> {

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseeMessages,setUnseenMessages] = useState({})

    const {axios, socket} = useContext(AuthContext)
// function to get users for sidebar
const getUsers = async()=>{
    try {
        const {data} = await axios.get("/api/messages/messages")
        if(data.success){
            setUsers(data.users)
            setUnseenMessages(data.unseeMessages)
        }
    } catch (error) {
        toast.error(error.message)
    }
}


//function to get messages for selected users
const getSelectedUsersMessage = async()=>{
    try {
        const {data} = await axios.get(`/api/messages/${selectedUser._id}`)
        if(data.success){
           setMessages(data.messages)
        }
    } catch (error) {
        toast.error(error.message)
    }
}

// function to send messages to selected user
 const sendMessage = async (content) => {
        try {
            if (!selectedUser?._id || !socket) {
                throw new Error('Cannot send message - no recipient or socket connection')
            }

            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, {
                text: typeof content === 'string' ? content : undefined,
                image: typeof content === 'object' ? content.image : undefined
            })

            if (data.success) {
                // Emit socket event for real-time updates
                socket.emit('newMessage', {
                    message: data.message,
                    receiverId: selectedUser._id
                })
                
                // Update local messages state
                setMessages(prev => [...prev, data.message])
            }
        } catch (error) {
            console.error('Send message error:', error)
            throw error
        }
    }

//function to subscribe to messages from selected user

const subscribeToMessage = async() =>{
    if(!socket)return
    socket.on("newMessage",(newMessage) =>{
    if(selectedUser && newMessage.senderId == selectedUser._id){
        newMessage.seen = true;
        setMessages((prevMessages)=>[...prevMessages, newMessage]);
        axios.put(`/api/messages//mark/${newMessage._id}`)
    }else{
        setUnseenMessages((prevunseeMessages) =>({
            ...prevunseeMessages,[newMessage.senderId]:
            prevunseeMessages[newMessage.senderId] ? prevunseeMessages[newMessage.senderId] + 1 : 1
        })
    )}
})
}

//function to unsubscribe to messages from selected user

const unSubscribeToMessages = ()=>{
    if(socket) socket.off("newMessage")
}

useEffect(()=>{
subscribeToMessage()
return unSubscribeToMessages()
},[socket,selectedUser])

    const value = {
        messages,
        users,
        selectedUser,
        setMessages,
        sendMessage,
        getUsers,
        getSelectedUsersMessage,
        unseeMessages,
        setSelectedUser,
        setUnseenMessages

        }
    return <messagesContext.Provider value={value}>
        {children}
    </messagesContext.Provider>
}