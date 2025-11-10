import React, { useState, useEffect, useContext } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import {messagesContext} from '../../context/messagesContext.jsx'
import toast from 'react-hot-toast'


const FriendSelectionPopup = ({ isOpen, onClose, friends, selectedFriends, onSelectFriend }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#282142] rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg">Add Friends to Group</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="space-y-2">
          {friends.map((friend) => (
            <div 
              key={friend._id} 
              className="flex items-center justify-between p-2 hover:bg-[#3A3454] rounded-lg"
            >
              <div className="flex items-center gap-2">
                <img 
                  src={friend.profilePic || assets.avatar_icon} 
                  className="w-10 h-10 rounded-full"
                  alt={friend.fullName} 
                />
                <span className="text-white">{friend.fullName}</span>
              </div>
              <input 
                type="checkbox"
                checked={selectedFriends.includes(friend._id)}
                onChange={() => onSelectFriend(friend._id)}
                className="w-4 h-4 accent-purple-600"
              />
            </div>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="mt-4 w-full p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Done
        </button>
      </div>
    </div>
  );
};

const GroupCreatePage = () => {
  const {authUser, createGroup, groupData} = useContext(AuthContext)
  const {users} = useContext(messagesContext)
  const [selectedImg, setSeletedImg] = useState(null)
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [groupBio, setGroupBio] = useState("")
  const [showFriendsPopup, setShowFriendsPopup] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [availableFriends, setAvailableFriends] = useState([]);
  const [creatingGroup, setCreatingGroup] = useState(false);



  const handleFriendSelection = (friendId) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setAvailableFriends(users);
      } catch (error) {
        toast.error('Failed to fetch friends list');
      }
    };
    fetchFriends();
  }, []);

  const onSubmitHandler = async (e) =>{
    e.preventDefault();
    setCreatingGroup(true)
    try {
      const groupData = {
        groupName,
        bio: groupBio,
        groupMembers: selectedFriends
      };

      if(!selectedImg){
        await createGroup(groupData);
        // if(data.success) {
        //   toast.success("Group created successfully!");
        // }
        navigate("/");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImg)
      reader.onload = async() =>{
        const base64Image = reader.result;
         await createGroup({
          ...groupData,
          group_profilePic: base64Image
        });
        // if(data.success) {
        //   toast.success("Group created successfully!");
        // }
        
        navigate("/");
      }
      setCreatingGroup(false)
    } catch (error) {
      toast.error("Failed to create group");
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-gray-600 p-10
      border-2 flex items-center justify-between  max-sm:flex-col-reverse rounded-lg'>
        <form  onSubmit={onSubmitHandler}  className='flex flex-col gap-2 items-center justify-center'>
          <h3>
            Group Details
          </h3>
          <hr className='my-2 border-t border-gray-500'/>
          <label className='px-2 flex justify-center items-center gap-1.5'  htmlFor="group_profilePic">
            <input onChange={(e)=>setSeletedImg(e.target.files[0])} id="group_profilePic" type="file" accept='.jpg,.png,.jpeg' className='flex items-center
            gap-3 cursor-pointer' hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon }
            className={`h-12 w-12 ${selectedImg? "rounded-full" : ""}`}  alt="" />
            upload Profile Image
          </label>
           <input value={groupName} onChange={(e) => setGroupName(e.target.value) } type="text" className='w-full p-2 border border-gray-500 rounded-md focus:outline-none
            focus:ring-2
          focus:ring-indigo-500'
            placeholder='group name' required />
            <textarea rows={4} className='w-full p-2 border border-gray-500 focus:outline-none focus:ring-2
            focus:ring-indigo-500'placeholder='provide a short bio' required
            onChange={(e)=> setGroupBio(e.target.value)} value={groupBio} >

          </textarea>
          <button 
            type="button"
            onClick={() => setShowFriendsPopup(true)}
           
            className="p-4 cursor-pointer rounded-xl w-full bg-[#3A3454] text-white hover:bg-[#4A4464] mb-2"
          >
            Add Friends to Group ({selectedFriends.length} selected)
          </button>
          <button type='submit'
           disabled={creatingGroup || selectedFriends.length === 0}
            className='p-4 cursor-pointer rounded-xl w-full bg-linear-to-br from-purple-400 to-purple-900'>
            create
          </button>
        </form>

        <FriendSelectionPopup 
          isOpen={showFriendsPopup}
          onClose={() => setShowFriendsPopup(false)}
          friends={availableFriends} 
          selectedFriends={selectedFriends}
          onSelectFriend={handleFriendSelection}
        />
        <div className='flex items-center justify-center max-h-44 rounded-full aspect-square'>
          <img  src={groupData?.group_profilePic || assets.logo_icon} />
    
        </div>
        
      </div>
     </div>
  )
}

export default  GroupCreatePage
