import React from 'react'
import {useAuthClient} from "../utils/useAuthClient"
function Home() {
    const {login, logout} = useAuthClient()
  return (
    <>
    <div onClick={login} className='bg-red-500 rounded-lg px[29px] py-[13px] text-[23px] '>
        Login
    </div>
    <div onClick={logout} className='bg-red-500 rounded-lg px[29px] py-[13px] text-[23px] '>
    Logout
</div>
</>
  )
}

export default Home