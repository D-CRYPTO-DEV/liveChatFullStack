import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const LoginPage = () => {

  
  const [fullName, setFullname] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [loginState, setLoginState] = useState(false)


  const {login, userState,setUserState} = useContext(AuthContext)
  const onSubmitHandler = async(e) => {
    e.preventDefault();
    setLoginState(true)
    
    if(userState === "signup" && !isDataSubmitted){
      setIsDataSubmitted(true);
      return
    }
    await login(userState === "signup" ? "signup" :"login",{
      fullName,
      password,
      email,
      bio
    })
    setLoginState(false);
  }


  return (

    <div className='min-h-screen bg-cover bg-center  flex items-center justify-center
    gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* ------- left side ------ */}
      <img src={assets.logo_big} alt="" className='w-[w-min(30vw,250px)]' />


      {/* ---------right side -------- */}
      <form onSubmit={onSubmitHandler} className=' border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col items-center justify-center
      gap-6 rounded-lg shadow-lg' action="">
        <h2 className='font-medium text-2xl w-full flex justify-between items-center'>
          {userState}
          {
            isDataSubmitted  &&(
              <img onClick={()=>isDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />
            )
          }
          
        </h2>

      { userState === "signup" && !isDataSubmitted && (
         <input value={fullName} onChange={(e) => setFullname(e.target.value) } type="text" name="" id="" className='w-full p-2 border border-gray-500 rounded-md focus:outline-none
         focus:ring-2
        focus:ring-indigo-500'
        placeholder='Full name' required />
      )
      }
      {!isDataSubmitted && (
         <>
            <input type="email"
            placeholder='Email Address'
            value={email} 
            onChange={(e) => setEmail(e.target.value) }
            className='w-full rounded-lg  p-2 border border-gray-500 focus:outline-none focus:ring-2
            focus:ring-indigo-500'
            required />

             <input type="password"
            placeholder='Enter your pass key'
            value={password} 
            onChange={(e) => setPassword(e.target.value) }
            className='w-full rounded-lg p-2 border border-gray-500 focus:outline-none focus:ring-2
            focus:ring-indigo-500'
            required />
        </>
      )
       
        
      }
      {
        userState === "signup" && isDataSubmitted && (
          <textarea rows={4} className='w-full p-2 border border-gray-500 focus:outline-none focus:ring-2 
            focus:ring-indigo-500'placeholder='provide a short bio' required
            onChange={(e)=> setBio(e.target.value)} value={bio} >

          </textarea>
        )
      }
      
      <button disabled ={loginState} type='submit' className={`p-4 cursor-pointer rounded-xl bg-purple w-full  ${loginState?"bg-purple-500":"bg-linear-to-br from-purple-400 to-purple-900"} `}>
        {userState === "signup" ? "create Account" : "Log in"}
      </button>
      

      <div className='flex items-center gap-2 text-sm text-gray-500'>
        <input type="checkbox" name="" id="" />
        <p>Agree to the terms of service and policy</p>
      </div>
       
      <div className='flex flex-col gap-2'>
        {
        userState === "signup" ? (
          <p className='text-gray-600 text-sm'>
            already have an account? <span onClick={()=>setUserState("Login")} className='cursor-pointer underline  text-purple-500' >login</span>
          </p>
        ) :(
          <p className='text-gray-600 text-sm'>
            don't have an account? <span onClick={()=>setUserState("signup")} className='cursor-pointer underline text-purple-500' >Sign up</span>
          </p>
        )
       }
      </div>
       


      </form>
    </div>
  )
}

export default LoginPage
