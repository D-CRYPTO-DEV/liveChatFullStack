import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



export const messagesContext = createContext()

export const MessageProvider = ({children})=> {

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [groups, setGroups] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [unseenMessages,setUnseenMessages] = useState({})
    const [unseenGroupMessages,setUnseenGroupMessages] = useState({})
    const[ groupMessages,setGroupMessages] = useState(null)

    const {axios, socket, authUser,groupData} = useContext(AuthContext)
     console.log("setting selected group from auth context:", groupData,selectedGroup)
    useEffect(()=>{
        if(selectedGroup && groupData && (groupData._id === selectedGroup._id)){
            if(selectedGroup.groupMembers !== groupData.groupMembers){
                console.log("setting selected group from auth context:", groupData)
                setSelectedGroup(groupData)
            }
           
        }
    },[selectedGroup,groupData])


   
// function to get users for sidebar
const getUsers = async()=>{
    try {
        const {data} = await axios.get("/api/messages/messages")
        if(data.success){
            setUsers(data.users)
            setUnseenMessages(data.unseenMessages)
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
               
                setMessages(prev => [...prev, data.message])
            }
        } catch (error) {
            console.error('Send message error:', error)
            throw error
        }
    }



// function to get groups for sidebar
const getGroups = async()=>{
    try {
        const {data} = await axios.get("/api/messages/groups-messages")
        if(data.success){
            setGroups(data.groups)
            setUnseenGroupMessages(data.unseenGroupMessages)
        }
    } catch (error) {
        toast.error(error.message)
    }
}

//function to get messages for selected groups
const getSelectedgroupMessages = async()=>{
    try {
        const {data} = await axios.get(`/api/messages/group-message/${selectedGroup._id}`)
        if(data.success){
           setGroupMessages(data.messages)
        }
    } catch (error) {
        toast.error(error.message)
    }
}

// function to send message to selected group

const sendGroupMessage = async(messageData) => {
    try {
        console.log("Sending group message:", { messageData, groupId: selectedGroup?._id });
        
        if (!selectedGroup?._id) {
            throw new Error('No group selected');
        }

        const {data} = await axios.post(`/api/messages/send-group/${selectedGroup._id}`, {
            text: typeof messageData === "string" ? messageData : undefined,
            image: typeof messageData === "object" ? messageData.image : undefined
        });

        console.log("Server response:", data);

        if(data.success) {
            // setGroupMessages(prevMessages => [...(prevMessages || []), data.message]);
            
            // Emit socket event for real-time updates
            // if (socket) {
            //     socket.emit("newGroupMessage", {
            //         message: data.message,
            //         groupId: selectedGroup._id
            //     });
            // }
            
            toast.success("Message sent successfully");
            return data.message;
        } else {
            throw new Error(data.message || "Failed to send message");
        }
    } catch (error) {
        console.error("Group message error:", error);
        toast.error(error.response?.data?.message || error.message);
        throw error;
    }
}

//function to subscribe to messages from selected user

const subscribeToGroupMessage = async() =>{
    if(!socket)return
    socket.on("groupMessage",async(newMessage) =>{
    if(selectedGroup && newMessage.groupId == selectedGroup._id){
        const upDate = newMessage.receiversId.find((member)=> member.groupMember.toString().toLowerCase() === authUser.toString().toLowerCase())
        if(upDate){
            upDate.seen = true;
            upDate.readAt = new Date();
        } 
        setGroupMessages((prevMessages)=>[...prevMessages, newMessage]);
        await axios.put(`/api/messages/mark/group/${newMessage._id}`)
    }else{
        setUnseenGroupMessages((prevunseenGroupMessages) =>({
            ...prevunseenGroupMessages,[newMessage.groupId]:
            prevunseenGroupMessages[newMessage.groupId] ? prevunseenGroupMessages[newMessage.groupId] + 1 : 1
        })
    )}

    
})
}

//function to unsubscribe to messages from selected user

const unSubscribeFromGroupMessages = ()=>{
    if(socket) socket.off("newMessage")
}

const subscribeToMessage = async() =>{
    if(!socket)return
    socket.on("privateMessage",async(newMessage) =>{
    if(selectedUser && newMessage.senderId == selectedUser._id){
        newMessage.seen = true;
        setMessages((prevMessages)=>[...prevMessages, newMessage]);
        await axios.put(`/api/messages/mark/${newMessage._id}`)
    }else{
        setUnseenMessages((prevunseenMessages) =>({
            ...prevunseenMessages,[newMessage.senderId]:
            prevunseenMessages[newMessage.senderId] ? prevunseenMessages[newMessage.senderId] + 1 : 1
        })
    )}
})
}

//function to unsubscribe to messages from selected user

const unSubscribeToMessages = ()=>{
    if(socket) socket.off("newMessage")
}



// MessageProvider.jsx
useEffect(() => {
    if (socket && selectedGroup) {
        // 1. Join the new group's room
        console.log(`Attempting to join group room: ${selectedGroup._id}`);
        socket.emit('joinGroup', selectedGroup._id);

    }
}, [socket, selectedGroup]);

useEffect(()=>{
subscribeToMessage()
return unSubscribeToMessages()
},[socket, selectedUser])


useEffect(()=>{
subscribeToGroupMessage()
return unSubscribeFromGroupMessages ()
},[socket,authUser,selectedGroup])

    // Group Management Functions
    const addMembersToGroup = async (groupId, memberIds) => {
        try {
            const { data } = await axios.post(`/api/messages/add-members/${groupId}`, { memberIds });
            if (data.success) {
                await getGroups();
                toast.success('Members added successfully');
                return data.group;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            throw error;
        }
    };

    const removeMembersFromGroup = async (groupId, memberIds) => {
        try {
            const { data } = await axios.post(`/api/messages/remove-members/${groupId}`, { memberIds });
            if (data.success) {
                await getGroups();
                toast.success('Members removed successfully');
                return data.group;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            throw error;
        }
    };

    const updateGroup = async (groupId, updates) => {
        try {
            const formData = new FormData();
            Object.entries(updates).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            const { data } = await axios.put(`/api/messages/update-group/${groupId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                await getGroups();
                if (selectedGroup?._id === groupId) {
                    setSelectedGroup(data.group);
                }
                toast.success('Group updated successfully');
                return data.group;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            throw error;
        }
    };

    const getGroupMembers = async (groupId) => {
        try {
            const { data } = await axios.get(`/api/messages/group-members/${groupId}`);
            if (data.success) {
                return data.members;
            }
            return [];
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return [];
        }
    };

    const value = {
        messages,
        users,
        selectedUser,
        setMessages,
        sendMessage,
        getUsers,
        getSelectedUsersMessage,
        unseenMessages,
        setSelectedUser,
        setUnseenMessages,
        groups,
        getGroups,
        selectedGroup,
        getSelectedgroupMessages,
        setSelectedGroup,
        unseenGroupMessages,
        groupMessages,
        sendGroupMessage,
        // Group Management Functions
        addMembersToGroup,
        removeMembersFromGroup,
        updateGroup,
        getGroupMembers
    }
    return <messagesContext.Provider value={value}>
        {children}
    </messagesContext.Provider>
}