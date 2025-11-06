import React, { useState, useContext, useEffect } from 'react'
import { messagesContext } from '../../context/messagesContext'
import assets from '../assets/assets'
import AddMembers from './pop_Ups/AddMembers.jsx'
import ViewMembers from './pop_Ups/ViewMembers'
import UpdateGroup from './pop_Ups/UpdateGroup'
import RemoveMembers from './pop_Ups/RemoveMembers'


const GroupActions = () => {
    const { selectedGroup } = useContext(messagesContext)
    
    const [showAction, setShowAction] = useState(false)
    const [showAddMembers, setShowAddMembers] = useState(false)
    const [showViewMembers, setShowViewMembers] = useState(false)
    const [showRemoveMembers, setShowRemoveMembers] = useState(false)
    const [showUpdateGroup, setShowUpdateGroup] = useState(false)

    const handleCloseModal = () => {
        setShowAddMembers(false)
        setShowViewMembers(false)
        setShowRemoveMembers(false)
        setShowUpdateGroup(false)
        setShowAction(false)
    }
    useEffect(()=> {
        
    })
    
    if (!selectedGroup) return null

    return (
        <div className="relative">
            <button 
                onClick={() => setShowAction(!showAction)} 
                className="group"
            >
                <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
                {showAction && (
                    <ul className='absolute text-white top-10 right-0 z-20 w-40 p-5 rounded-md
                    bg-[#282142] border border-gray-600'>
                        <li 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowViewMembers(true);
                                setShowAction(false)
                            }} 
                            className='rounded-full p-1.5 hover:bg-gray-700 cursor-pointer text-sm'
                        >
                            View Members
                        </li>
                        <li 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowAddMembers(true);
                                setShowAction(false)
                            }} 
                            className='rounded-full p-1.5 hover:bg-gray-700 cursor-pointer text-sm'
                        >
                            Add Members
                        </li>
                        <li 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowRemoveMembers(true);
                                setShowAction(false)
                            }} 
                            className='rounded-full p-1.5 hover:bg-gray-700 cursor-pointer text-sm'
                        >
                            Remove Members
                        </li>
                        <li 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowUpdateGroup(true);
                                setShowAction(false)
                            }} 
                            className='rounded-full p-1.5 hover:bg-gray-700 cursor-pointer text-sm'
                        >
                            Update Group
                        </li>
                    </ul>
                )}
            </button>

            {showAddMembers && (
                <AddMembers 
                    groupId={selectedGroup._id}
                    members={selectedGroup.groupMembers} 
                    onClose={handleCloseModal} 
                />
            )}

            {showViewMembers && (
                <ViewMembers 
                    members={selectedGroup.groupMembers} 
                    onClose={handleCloseModal}  
                />
            )}

            {showRemoveMembers && (
                <RemoveMembers 
                    groupId={selectedGroup._id}
                    members={selectedGroup.groupMembers}
                    onClose={handleCloseModal}
                />
            )}

            {showUpdateGroup && (
                <UpdateGroup 
                    groupId={selectedGroup._id}
                    currentName={selectedGroup.name}
                    currentDescription={selectedGroup.description}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    )
}

export default GroupActions