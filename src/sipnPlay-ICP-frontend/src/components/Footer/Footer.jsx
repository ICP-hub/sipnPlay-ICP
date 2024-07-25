import React from 'react';
import { BsDiscord } from "react-icons/bs";
import { BsTelegram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import logo from "../../assets/images/logo.jpeg";
const Footer = () => {
  return (
    <div className='px-[9%] opacity-70 bg-gradient-to-r from-custom-gradient-start to-custom-gradient-end -mt-4 pb-6 flex justify-between '>
      <div className='my-auto'>
      <img draggable="false" className='w-[200px]' src={logo} />
      <p className='font-adam font-[300]  text-[20px] text-[#96839B]  '>All rights reserved @sipnplay</p>
      </div> 
      <div className='flex my-auto gap-4 items-center'>
        <p className='font-adam font-[300] text-[20px] text-[#96839B]'>Follow us on</p>
        <BsDiscord size={33} />
        <BsTelegram size={33} />
        <BsTwitterX size={33} />
      </div>
    </div>
  )
}

export default Footer