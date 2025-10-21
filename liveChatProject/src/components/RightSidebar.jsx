import React, { useContext } from 'react'
import assets from '../assets/assets'
import { messagesContext } from '../../context/messagesContext'

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(messagesContext)

  if (!selectedUser) return null

  return (
    <div className='relative hidden md:flex flex-col h-full'>
      {/* Profile Section */}
      <div className='flex flex-col items-center justify-center gap-1.5 p-5'>
        <img 
          className='w-24 h-24 rounded-full object-cover' 
          src={selectedUser.profilePic || assets.avatar_icon} 
          alt={selectedUser.fullName}
        />
        <h2 className='text-gray-300 font-semibold'>
          {selectedUser.fullName}
        </h2>
        <p className='w-40 text-xs text-center text-gray-400'>
          {selectedUser.bio || "No bio available"}
        </p>
        <hr className='my-2 w-full border-t border-gray-500'/>
      </div>

      {/* Media Section */}
      <div className='px-3 flex-1 min-h-0 overflow-y-auto'>
        <h2 className='text-white mb-2'>Media</h2>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-2.5   '>
          {messages
            .filter(msg => msg.image)
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
      <div className='p-3 mt-auto'>
        <button className='bg-gradient-to-r from-purple-500 to-purple-900 w-full p-3 rounded-full text-white hover:opacity-90 transition-opacity'>
          Logout
        </button>
      </div>
    </div>
  )
}

export default RightSidebar