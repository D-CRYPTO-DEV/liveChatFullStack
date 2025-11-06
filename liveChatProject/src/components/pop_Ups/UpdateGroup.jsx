import React, { useContext, useState } from 'react'
import { messagesContext } from '../../../context/messagesContext'
import { AuthContext } from '../../../context/AuthContext'

const UpdateGroup = ({ group,onClose }) => {
    const { selectedGroup } = useContext(messagesContext)
    const { updateGroupProfile} = useContext(AuthContext)
    const [formData, setFormData] = useState({
        groupName: group?.groupName || "",
        bio: group?.bio || '',
        group_profilePic: null
    })
    const [loading, setLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)

    const handleChange = (e) => {
       
        const { name, value, files } = e.target
        if (name === 'group_profilePic' && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            console.log("previewImage before reading:", previewImage,files[0])
            reader.readAsDataURL(file)
            reader.onload = async() =>{
                const base64Image = reader.result;
                setFormData(prev => ({ ...prev, [name]: base64Image }) )
                setPreviewImage(base64Image);
            }
        ;
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.groupName.trim()) return

        setLoading(true)
        try {
            const updates = new FormData()
            updates.append('groupName', formData.groupName)
            updates.append('bio', formData.bio)
            if (formData.group_profilePic) {
                updates.append('group_profilePic', formData.group_profilePic)
            }
            console.log("updates to be sent:", updates,formData.bio, formData.groupName,formData.group_profilePic,updates.getAll("groupName"))

            await updateGroupProfile(selectedGroup?._id, updates)
            onClose()
        } catch (error) {
            console.error('Error updating group:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#282142] rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl text-white font-semibold mb-4">Update Group</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white mb-2">Group Name</label>
                        <input
                            type="text"
                            name="groupName"
                            value={formData.groupName}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Group Picture</label>
                        <input
                            type="file"
                            name="group_profilePic"
                            onChange={(e)=>handleChange(e)}
                            accept="image/*"
                            className="hidden"
                            id="group-pic"
                        />
                        <label
                            htmlFor="group-pic"
                            className="block w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 cursor-pointer hover:bg-gray-600"
                        >
                            Choose Image
                        </label>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Group preview"
                                className="mt-2 w-20 h-20 rounded-full object-cover"
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-white hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.groupName.trim()}
                            className={`px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700
                                ${(loading || !formData.groupName.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Updating...' : 'Update Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateGroup
