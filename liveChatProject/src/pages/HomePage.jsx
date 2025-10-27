import React from 'react'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import Sidebar from '../components/sidebar'
import  { userDummyData } from '../assets/assets'
import { useContext } from 'react'
import { messagesContext } from '../../context/messagesContext'





const HomePage = () => {

  const {selectedUser,selectedGroup} = useContext(messagesContext)
   
  return (
    <div className=' border w-full h-screen sm:px-[15%] sm:py-[5%] '>
     <div className={`overflow-y-hidden h-[100%] backdrop-blur-xl border-2 border-gray-600
        rounded-2xl grid grid-cols-1 relative ${(selectedUser || selectedGroup) ? "md:grid-cols-[1fr_1.5fr_1fr] " : "md:grid-cols-2"}`}>
        <Sidebar />
        <ChatContainer  />
        <RightSidebar/>
     </div>
    </div>
  )
}

export default HomePage
