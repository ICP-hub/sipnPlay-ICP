import React from 'react'
import {useAuthClient} from "../utils/useAuthClient"
function Home() {
    const {login} = useAuthClient()
  return (
    <div onClick={login} className='bg-red-500 rounded-lg px[29px] py-[13px] text-[23px] '>
        Login
    </div>
  )
}

export default Home