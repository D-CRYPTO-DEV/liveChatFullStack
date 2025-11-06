import React, { useContext, useEffect, useRef, useState } from 'react'
import formatMessageTime from "../lib/utils"
import { messagesContext } from '../../context/messagesContext'
import { AuthContext } from '../../context/AuthContext'
import assets from '../assets/assets'
import toast from 'react-hot-toast'
import GroupActions from './GroupActions'

const ChatContainer = () => {
  
  const {authUser} = useContext(AuthContext)
  const {selectedUser,getSelectedUsersMessage, messages,sendMessage,getSelectedgroupMessages,groupMessages,setSelectedGroup,setSelectedUser,selectedGroup,sendGroupMessage} = useContext(messagesContext)
  const[input,setInput] = useState("");
  const ScrollEnd = useRef()
  const DisplayedMessage = selectedUser ? messages : groupMessages;

  // function to handle submitting of messages

 const handleSendMessage = async(e) => {
    e.preventDefault()
    if(!input.trim()) return null
    
    try {
        // Debug logs
        console.log("Sending message:", {
            input: input.trim(),
            selectedUser,
            selectedGroup
        });

        if(selectedUser) {
            await sendMessage(input.trim());
            console.log("Private message sent");
        } else if(selectedGroup) {
            await sendGroupMessage(input.trim());
            console.log("Group message sent");
        } else {
            toast.error("Please select a chat first");
            return;
        }
        
        setInput("");
    } catch (error) {
        console.error("Send message error:", error);
        toast.error(error.message || "Failed to send message");
    }
}


  //function for handling sending pictures


  const handleSendImage = async(e) =>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("Please select a valid image file")
      return;
    }

    if(!selectedUser && !selectedGroup) {
      toast.error("Please select a chat first");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        console.log("Sending image to:", selectedUser ? "user" : "group");
        
        if(selectedUser) {
          await sendMessage({image: reader.result});
          console.log("Image sent to user");
        } else if(selectedGroup) {
          await sendGroupMessage({image: reader.result});
          console.log("Image sent to group");
        }
        
        e.target.value = "";
        toast.success("Image sent successfully");
      } catch (error) {
        console.error("Image send error:", error);
        toast.error("Failed to send image");
      }
    };

    reader.onerror = () => {
      toast.error("Failed to process image");
    };

    reader.readAsDataURL(file);
  }


  useEffect(()=>{
    if(selectedUser){
      getSelectedUsersMessage()
    }
    if(selectedGroup){
      getSelectedgroupMessages()
    }
  },[selectedUser,selectedGroup])
  

    useEffect(() => {
      if(ScrollEnd.current && DisplayedMessage?.length){
      ScrollEnd.current.scrollIntoView({behavior : "smooth"})
    }},[DisplayedMessage])

  return (
   


    <div className={`relative flex flex-col ${(selectedUser || selectedGroup) ? "h-screen z-30 md:h-[80vh]" : "h-screen md:h-full hidden md:visible " }`}>
      {
        (selectedUser || selectedGroup) ? ( 
        <div className='flex flex-col h-full'>
          {/* upper profile section of chat */}
          <div className='flex-shrink-0   h-[12%] md:h-[12%]'>
            <div className='flex items-center h-full justify-between p-2'>
              <img onClick={()=>{setSelectedUser(null), setSelectedGroup(null)}} className='w-8 h-8 rounded-full md:hidden ' src={assets.Backarrow} alt="backarrow" />
              <div className='flex items-center gap-2 pt-2 cursor-pointer'>
                <img src={selectedUser?.profilePic ||selectedGroup?.group_profilePic || assets.avatar_icon} alt="profilePic" className='w-8 h-8   aspect-[1/1] rounded-full' />
                <p className='text-white capitalize'>{selectedUser?.fullName || selectedGroup?.groupName}</p>
              </div>
              
            {selectedUser ? (
              <img src={assets.help_icon} className='w-6 h-6 cursor-pointer' alt="help" />
            ) : (
              <GroupActions />
            )}
          </div>
            <hr className='my-0 border-t border-gray-500'/>
          </div>
          
          
          {/* chat section proper */}
          <div className='overflow-y-auto flex-1 h-[70%]  min-h-0 pb-6'>
            {
              DisplayedMessage?.map((msg) => (
                
                <div key={msg._id} className={`${msg.senderId === authUser._id ? "ml-auto" :""}  p-2 rounded-2xl my-4  max-w-[60%] flex flex-col gap-1`}>
                  {
                    msg.image ? (
                      <img className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' src={msg.image} alt="" />
                    ) : (
                    
                      <p className='text-white text-xs mx-8  rounded-2xl p-2 bg-[#282142]'>
                      {msg.text}
                      </p>
                     
                      )
                  }
                  <div className={`${msg.senderId === authUser._id ? "ml-auto" :"mr-auto"} flex flex-col justify-center items-center`}>
                    <img  className={`w-8 h-8 aspect-[1/1] rounded-full`} src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" />
                    <p className='text-xs text-gray-500'>{formatMessageTime(msg.createdAt) }</p>
                  </div>

                  </div>
                  
              ))
            }
            <div ref={ScrollEnd}></div>
          </div>
         {/* send button and chatbox section */}

         <div className='flex-shrink-0 flex p-2 max-h-[22%]   w-full'>
          <div className='w-[82%] flex rounded-full bg-[#282142] p-3 mr-auto cursor-pointer border-0 text-white '>
            <input onChange={(e)=>setInput(e.target.value) }  value={input} onKeyDown={e=>{ e.key ==="Enter" ? handleSendMessage(e) : null}} placeholder='send a message' className='outline-none w-full' type="text" />
            <input onChange={handleSendImage}  className='outline-none w-full ' id='image' type="file" accept='image/jpg, image/png' hidden/>
            <label htmlFor="image">
              <img className='w-5 h-5 mr-2 cursor-pointer' src={assets.gallery_icon} alt="" />
            </label>
          </div>
          <img className='cursor-pointer' onClick={handleSendMessage} src={assets.send_button} alt="" />
         </div>
        </div>
        ) : (
        <div className='flex flex-col h-[80%] items-center justify-center gap-2 text-gray-500 
         bg-white/10 max-md:hidden'>
          <img src={assets.logo_icon} className='max-w-16' alt="" />
          <p className='text-lg text-white font-medium'> chat anytime, anywhere. </p>
        </div>
        )

       
        
      }
      
    </div>
  )
}

export default ChatContainer
