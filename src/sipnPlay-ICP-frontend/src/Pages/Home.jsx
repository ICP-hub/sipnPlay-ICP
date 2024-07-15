import React, { useEffect } from 'react'
import { useAuth } from "../utils/useAuthClient"
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
function Home() {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated, backendActor } = useAuth();

  const getStatus = async()=>{
    const getUser = await backendActor.getUser();
    if(getUser.err === "New user"){
      navigate("/register");
      }else{
        toast.success("You are registered");
      }
  } 

  useEffect(() => {
    if (isAuthenticated) {
      getStatus();          
    } else {
      toast.error("You are logged out");
    }
  }, [isAuthenticated])

  const Letslogin = async (val) => {
    try {
      await login(val);  
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  }

  const checkUser = async () => {
    const res = await backendActor.getUser();
    console.log(res);
  }

  return (
    <div className=''>
      <div onClick={() => Letslogin("ii")} className='bg-red-500 rounded-lg px-[29px] py-[13px] text-[23px] '>
        Login with icp
      </div>
      <div onClick={() => Letslogin("nfid")} className='bg-red-500 rounded-lg px-[29px] py-[13px] text-[23px] '>
        Login with NFID
      </div>
      <div onClick={() => { logout(); window.location.reload() }} className='bg-red-500 rounded-lg px-[29px] py-[13px] text-[23px] '>
        Logout
      </div>
      <div onClick={() => { checkUser(); }} className='bg-red-500 rounded-lg px-[29px] py-[13px] text-[23px] '>
        Check me
      </div>
    </div>
  )
}

export default Home