import React, { useEffect, useState } from 'react'
import assets, { userDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { messagesContext } from '../../context/messagesContext.jsx'





const Sidebar = () => {
    const {logout, onlineUsers} = useContext(AuthContext)
    const {selectedUser,users,setSelectedUser,getUsers,unseenMessages} =useContext(messagesContext)
    const navigate = useNavigate();

    const [input, setInput] = useState(false)

    const filteredUsers = input ?  users.filter((user)=> user.fullName.toLowerCase().includes(input.toLowerCase())) : users
       


    useEffect(()=>{
        getUsers()
    },[onlineUsers])
   

  return (
    <div>
     <div className='pb-5'>
        <div className='flex items-center justify-between'>
            <img src={assets.logo} alt="logo" className='max-w-40' />
            <div className='group py-2 relative'>
                <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
                <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md
                bg-[#282142] border border-gray-600 hidden text-gray-100 group-hover:block'>
                    <p onClick={()=>{navigate("/profile")}} className='rounded-full p-1.5 hover:bg-gray-700 cursor-pointer text-sm'>
                        Edit Profile
                    </p><hr className='my-2 border-t border-gray-500'/>
                    
                    <p onClick={logout} className='rounded-full p-1.5 hover:bg-gray-700 cursor-pointer text-sm'>
                        Logout
                    </p>
                </div>
            </div>
        </div>
        <div className='flex bg-[#282142] rounded-full items-center
            py-3 px-4 mt-5 gap-2'>
            <img src={assets.search_icon} alt="search" className='w-3' />
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none
            outline-none text-xs text-white placeholder-[#c8c8c8] flex-1'
            placeholder='Search friend'/>
        </div>
     </div>
     <div>
        {filteredUsers.map((user, index) => (
           
            <div key={index} onClick={() => setSelectedUser(user)} className={`relative flex items-center gap-2 p-2 pl-4 rounded-2xl cursor-pointer max-sm *
                text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                <img src={user?.profilePic || assets.avatar_icon} alt="profile_img"
                className='w-[35px] aspect-[1/1] rounded-full'/>

                <div className='flex flex-col leading-5'>
                    <p className='text-xs text-white'>
                        {user.fullName}
                    </p>
                    <p className='text-xs '>
                        {onlineUsers.includes(user._id) ? <span className='text-green-400'>online</span >  : <span className='text-gray-400'>offline</span> }
                    </p>
                    {/* {
                        unseenMessages[user._id]  && <p className='text-xs h-5 w-5 flex justify-center
                        items-center rounded-full bg-violet-500/50 absolute top-4 right-4'>
                            {unseenMessages[user._id].length}
                        </p>
                    } */}
                </div>
            </div>
           
        ))}
     </div>
    </div>
  )
}

export default Sidebar
