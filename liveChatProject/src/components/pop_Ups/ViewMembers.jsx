import React, { useContext } from 'react'
import { messagesContext } from '../../../context/messagesContext.jsx'
import assets from '../../assets/assets.js'

const View_members = ( {members, onClose}) => {
  const memberList =  members
  const { users } = useContext(messagesContext)
  console.log("members in view members:",memberList, members,users)
  
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <div className='flex flex-col gap-5'>
         <div className="max-h-80 flex flex-col gap-2 w-[60vw] overflow-y-auto mb-4">
            {users.filter((user)=>memberList.includes(user._id)).map(user => (
                <div 
                    key={user._id}
                  
                    className={`flex items-center gap-3 p-2 w-full rounded-lg cursor-pointer hover:bg-purple-900/20
                      ${memberList.includes(user._id) ? 'bg-purple-900/30' : ''}`}
                >
                  <img className={`w-8 h-8 rounded-full`} src={user.profilePic || assets.avatar_icon} alt="" />
                  <span className="text-white">{user.fullName}</span>
                </div>
            ))}
          </div>
          <button
          type='button'
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-gray-700"
          >
              ok
          </button>
      </div>

    </div>
  )
}

export default View_members
