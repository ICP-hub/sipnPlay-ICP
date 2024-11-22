import React from "react";
import { BsDiscord } from "react-icons/bs";
import { BsTelegram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="px-4 py-2 bg-gradient-to-r from-custom-gradient-start to-custom-gradient-end flex justify-between text-xs md:text-md lg:text-lg">
      <div className="my-auto">
        <img draggable="false" className="max-w-28 sm:max-w-40" src={logo} />
        <p className="hidden md:block font-adam font-[300] text-sm md:text-md lg:text-lg  text-[#96839B]  ">
          All rights reserved @sipnplay
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center md:gap-4">
        <p className="font-adam font-[300] text-sm md:text-md lg:text-lg text-[#96839B]">
          Follow us on
        </p>
        <div className="flex gap-4 items-center my-auto">
          <Link to="https://discord.com/invite/6PmNCezvG4" target="__blank">
            <BsDiscord size={30} />
          </Link>
          <Link to="https://t.me/+BpcBOPokAFtmYWE1" target="__blank">
            <BsTelegram size={30} />
          </Link>
          <Link to="https://x.com/SipnPlayGames" target="__blank">
            <BsTwitterX size={30} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
