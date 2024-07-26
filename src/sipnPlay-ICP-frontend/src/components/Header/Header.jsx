import React from 'react';
import logo from '../../assets/images/logo.png'; 
import AnimationButton from '../../common/AnimationButton';
import GradientText from '../../common/GradientText';


const Header = () => {
  return (
    <nav className="relative bg-black shadow-lg px-[9%] py-9 flex justify-between items-center overflow-hidden ">
     
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-[50px] w-[200px]" />
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8">
      <a href="#home" className="underline decoration-pink-400 underline-offset-8">
  <GradientText children="Home"/>
</a>
        <a href="#our-team" className=""><GradientText children="Our Team"/></a>
        <a href="#contact-us" className=""><GradientText children="Contact Us"/></a>
        <a href="#lets-cook" className=""><GradientText children="Let's Cook"/></a>
      </div>

      {/* Join Waitlist Button */}
      <div>
        <button className="">
        <AnimationButton text="Join Waitlist" />
        </button>
      </div>
    </nav>
  );
};

export default Header;
