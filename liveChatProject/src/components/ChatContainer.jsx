import React, { useContext, useEffect, useRef, useState } from 'react'
import formatMessageTime from "../lib/utils"
import { messagesContext } from '../../context/messagesContext'
import { AuthContext } from '../../context/AuthContext'
import assets from '../assets/assets'
import toast from 'react-hot-toast'

const ChatContainer = () => {
  
  const {authUser} = useContext(AuthContext)
  const {selectedUser,getSelectedUsersMessage, messages,sendMessage} = useContext(messagesContext)
  const[input,setInput] = useState("");
  const ScrollEnd = useRef()


  // function to handle submitting of messages

 const handleSendMessage = async(e) => {
    e.preventDefault()
    if(!input.trim() || !selectedUser) return null
    
    try {
        await sendMessage(input.trim())
        setInput("")
    } catch (error) {
        console.error("Send message error:", error)
        toast.error(error.message || "Failed to send message")
    }
}


  //function for handling sending pictures


  const handleSendImage = async(e) =>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("select an image")
      return;
    }
    const reader = new FileReader();

    reader.onloadend = async ()=>{
      await sendMessage({image:reader.result})
      e.target.value=""
    }
    reader.readAsDataURL(file)
  }


  useEffect(()=>{
    if(selectedUser){
      getSelectedUsersMessage()
    }
  },[selectedUser])
  

    useEffect(() => {
      if(ScrollEnd.current && messages?.length){
      ScrollEnd.current.scrollIntoView({behavior : "smooth"})
    }},[messages])

  return (
   


    <div className='relative h-screen'>
      {
        selectedUser ? ( 
        <div className='flex flex-col h-[100%]  '>
          {/* upper profile section of chat */}
          <div className=''>
            <div className='flex items-center justify-between p-2'>
            <div className='flex items-center gap-2 pt-2 cursor-pointer'>
              <img src={selectedUser.profilePic || assets.avatar_icon} alt="profilePic" className='w-8 h-8   aspect-[1/1] rounded-full' />
              <p className='text-white capitalize'>{selectedUser.fullName}</p>
            </div>
            <img src={assets.help_icon} className='w-6 h-6 cursor-pointer' alt="help" />
            <hr className=' border-0 border-t-2 border-gray-500'/>
          </div>
          
          </div>
          {/* chat section proper */}
          <div className='overflow-y-auto flex-1  min-h-0 pb-6'>
            {
              messages?.map((msg) => (
                
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

         <div className='flex p-2 absolute bottom-0  w-full'>
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
