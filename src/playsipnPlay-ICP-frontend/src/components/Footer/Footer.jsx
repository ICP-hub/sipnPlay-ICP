import React from "react";
import { BsDiscord } from "react-icons/bs";
import { BsTelegram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="px-4 py-8 bg-gradient-to-r from-custom-gradient-start to-custom-gradient-end -mt-4 pb-6 flex justify-between text-xs md:text-md lg:text-lg ">
      <div className="my-auto">
        <img draggable="false" className="w-[200px]" src={logo} />
        <p className="font-adam font-[300]  text-[20px] text-[#96839B]  ">
          All rights reserved @sipnplay
        </p>
      </div>
      <div className="flex my-auto gap-4 items-center">
        <p className="font-adam font-[300] text-[20px] text-[#96839B]">
          Follow us on
        </p>
        <Link to="https://discord.com/invite/6PmNCezvG4" target="__blank">
          <BsDiscord size={33} />
        </Link>
        <Link to="https://t.me/+BpcBOPokAFtmYWE1" target="__blank">
          <BsTelegram size={33} />
        </Link>
        <Link to="https://x.com/SipnPlayGames" target="__blank">
          <BsTwitterX size={33} />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
