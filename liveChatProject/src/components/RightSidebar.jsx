import React, { useContext } from 'react'
import assets from '../assets/assets'
import { messagesContext } from '../../context/messagesContext'
import { AuthContext } from '../../context/AuthContext'

  const RightSidebar = () => {
  const { selectedUser, messages,groups,selectedGroup,groupMessages } = useContext(messagesContext)
  const { onlineUsers,logout} = useContext(AuthContext)
  const displayedMessage = selectedUser ? messages : groupMessages;

  if (!selectedUser && !selectedGroup) return null

  return (
    <div className='relative hidden md:flex flex-col h-[80vh]'>
      {/* Profile Section */}
      <div className='flex-shrink-0 flex flex-col items-center justify-center gap-1.5 p-5'>
        <img 
          className='w-24 h-24 rounded-full object-cover' 
          src={selectedUser?.profilePic || selectedGroup?.group_profilePic || assets.avatar_icon} 
          alt={selectedUser?.fullName || selectedGroup?.groupName}
        />
        <h2 className='text-gray-300 font-semibold'>
          {
            onlineUsers.includes(selectedUser) && <span className='w-2 h-2 rounded-full bg-green-600'></span>
          }
          {selectedUser?.fullName || selectedGroup?.groupName}
        </h2>
        <p className='w-40 text-xs text-center text-gray-400'>
          {selectedUser?.bio ||selectedGroup?.bio || "No bio available"}
        </p>
        <hr className='my-2 w-full border-t border-gray-500'/>
      </div>

      {/* Media Section */}
      <h2 className='text-white mb-2'>Media</h2>
      <div className='px-3 flex-1 max-h-[50%] min-h-0 overflow-y-auto '>
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-2.5   '>
          {displayedMessage
            ?.filter(msg => msg.image)
            .map((msg, index) => (
              <img 
                key={msg._id || index}
                onClick={() => window.open(msg.image)}
                className='cursor-pointer w-full aspect-square object-cover rounded-lg hover:opacity-90'
                src={msg.image}
                alt={`Shared media ${index + 1}`}
              />
            ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className='p-3 pt-0 absolute bottom-0 w-full mt-auto'>
        <button onClick={logout} className='bg-gradient-to-r from-purple-500 to-purple-900 w-full p-3 rounded-full text-white hover:opacity-90 transition-opacity'>
          Logout
        </button>
      </div>
    </div>
  )
}

export default RightSidebar