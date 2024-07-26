import React from 'react';
import difinitylogo from '../../assets/images/difinityLogo.png';
import IClogo from "../../assets/images/IClogo.png";
import hublogo from "../../assets/images/hubsLogo.png";
import textoutline from "../../assets/images/textOutline.png";

const TrustedBy = () => {
  return (
    <div className="p-8 mb-20 bg-black-100">
       <div className="relative inset-0 flex justify-center items-start mt-14 mb-[34px] -z-10">
        <img
          src={textoutline}
          alt="outlines"
          className="w-56 h-22 object-cover"
        />
        <h2 className="text-2xl absolute top-8 font-bold font-adam text-center mb-[6%]">Trusted by</h2>
      </div>

      <div className="flex justify-between gap-10 mx-[9%]">
        <img draggable="false" src={difinitylogo} alt="Trusted Brand 1" 
        className="w-40 h-20 object-contain  
        grayscale transition-transform duration-300 ease-in-out hover:grayscale-0"  />
        <img draggable="false" src={IClogo} alt="Trusted Brand 2" 
        className="w-64 h-14 object-contain 
        grayscale transition-transform duration-300 ease-in-out hover:grayscale-0 "/>
        <img draggable="false" src={hublogo} alt="Trusted Brand 3" 
        className="w-80 h-14 object-contain 
        grayscale transition-transform duration-300 ease-in-out hover:grayscale-0" />
      </div>
    </div>
  );
};

export default TrustedBy;
