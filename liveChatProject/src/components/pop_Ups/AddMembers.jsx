import React, { useContext, useState, useEffect } from 'react'
import { messagesContext } from '../../../context/messagesContext'
import { AuthContext } from '../../../context/AuthContext'

const AddMembers = ({ groupId,members, onClose }) => {
    const { users, getUsers } = useContext(messagesContext)
    const { authUser,addMembersToGroup } = useContext(AuthContext)
    const [selectedMembers, setSelectedMembers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getUsers()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (selectedMembers.length === 0) return
        
        setLoading(true)
        try {

            console.log("Adding members:", selectedMembers, groupId)
            await addMembersToGroup(groupId, selectedMembers)
            console.log("groupId && selectedMembers:",groupId, selectedMembers)
            onClose()
        } catch (error) {
            console.error('Error adding members:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleMember = (userId) => {
        setSelectedMembers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    return (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#282142] rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl text-white font-semibold mb-4">Add Members</h2>
                
                <div className="max-h-60 overflow-y-auto mb-4">
                    {users
                        .filter(user => user._id !== authUser && !members.includes(user._id))
                        .map(user => (
                            <div 
                                key={user._id}
                                onClick={() => toggleMember(user._id)}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-purple-900/20
                                    ${selectedMembers.includes(user._id) ? 'bg-purple-900/30' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(user._id)}
                                    onChange={() => {}}
                                    onClick={()=>setSelectedMembers(prev=> [...prev,user._id])}
                                    className="rounded border-gray-400"
                                />
                                <span className="text-white">{user.fullName}</span>
                            </div>
                        ))
                    }
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-white hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || selectedMembers.length === 0}
                        className={`px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700
                            ${(loading || selectedMembers.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Adding...' : 'Add Members'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddMembers
