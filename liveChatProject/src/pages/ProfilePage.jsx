import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)
  const [selectedImg, setSeletedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio)


  const onSubmitHandler = async (e) =>{
    e.preventDefault();
    try {
      if(!selectedImg){
      await updateProfile({fullName:name,bio});
      navigate("/");
      return
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImg)
      reader.onload = async() =>{
        const base64Image = reader.result;
        await updateProfile({profilePic: base64Image, fullName:name,bio})
      }
      navigate("/")
    } catch (error) {
      toast.error(error.message)
    }
   
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-gray-600 p-10
      border-2 flex items-center justify-between  max-sm:flex-col-reverse rounded-lg'>
        <form  onSubmit={onSubmitHandler}  className='flex flex-col gap-2 items-center justify-center'>
          <h3>
            Profile Details
          </h3>
          <hr className='my-2 border-t border-gray-500'/>
          <label className='px-2 flex justify-center items-center gap-1.5'  htmlFor="profilePic">
            <input onChange={(e)=>setSeletedImg(e.target.files[0])} id="profilePic" type="file" accept='.jpg,.png,.jpeg' className='flex items-center
            gap-3 cursor-pointer' hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon }
            className={`h-12 w-12 ${selectedImg? "rounded-full" : ""}`}  alt="" />
            upload Profile Image
          </label>
           <input value={name} onChange={(e) => setName(e.target.value) } type="text" className='w-full p-2 border border-gray-500 rounded-md focus:outline-none
            focus:ring-2
          focus:ring-indigo-500'
            placeholder='Full name' required />
            <textarea rows={4} className='w-full p-2 border border-gray-500 focus:outline-none focus:ring-2
            focus:ring-indigo-500'placeholder='provide a short bio' required
            onChange={(e)=> setBio(e.target.value)} value={bio} >

          </textarea>
          <button type='submit' className='p-4 cursor-pointer rounded-xl w-full bg-linear-to-br from-purple-400 to-purple-900'>
            save
          </button>
        </form>
        <div className='flex items-center justify-center max-h-44 rounded-full aspect-square'>
          <img  src={authUser?.profilePic || assets.logo_icon} />
    
        </div>
        
      </div>
     </div>
  )
}

export default ProfilePage
