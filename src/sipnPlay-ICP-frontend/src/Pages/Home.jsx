import React from 'react'
import {useAuthClient} from "../utils/useAuthClient"
import { Navigate, useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
    const {login, logout} = useAuthClient();
    const Letslogin =async(val)=>{
      let res = await login(val);
      const exists=await res?.getUser();
      if(exists.err==="New user"){
        navigate("/register");
      }else{
        alert("welcome back user");
      }
    }
  return (
    <>
    <div onClick={()=>Letslogin("ii")} className='bg-red-500 rounded-lg px[29px] py-[13px] text-[23px] '>
        Login with icp
    </div>
    <div onClick={()=>Letslogin("nfid")} className='bg-red-500 rounded-lg px[29px] py-[13px] text-[23px] '>
        Login with NFID
    </div>
    <div onClick={()=>{logout(); window.location.reload()}} className='bg-red-500 rounded-lg px[29px] py-[13px] text-[23px] '>
    Logout
</div>
</>
  )
}

export default Home