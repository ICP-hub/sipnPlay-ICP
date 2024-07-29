import React from 'react';
import difinitylogo from '../../assets/images/difinityLogo.png';
import IClogo from "../../assets/images/IClogo.png";
import hublogo from "../../assets/images/hubsLogo.png";
import textoutline from "../../assets/images/textOutline.png";

const TrustedBy = () => {
  return (
    <div className="p-8 mb-12 md:mb-20 bg-black-100">
       <div className="relative inset-0 flex justify-center items-start mt-3 md:mt-14 mb-[34px] -z-10">
        <img
          src={textoutline}
          alt="outlines"
          className="h-[84px] md:w-56 w-[161px] md:h-22"
        />
        <h2 className="text-[24px] md:text-2xl absolute top-4 md:top-8 font-bold font-adam text-center mb-[6%]">Trusted by</h2>
      </div>

      <div className="flex items-center flex-wrap md:justify-between gap-10 mx-[9%]">
        <img draggable="false" src={difinitylogo} alt="Trusted Brand 1" 
        className="w-[112px] md:w-40 h-[58px] md:h-20 mx-auto object-contain  
        grayscale transition-transform duration-300 ease-in-out hover:grayscale-0"  />
        <img draggable="false" src={IClogo} alt="Trusted Brand 2" 
        className="w-[181px] md:w-64 h-[37px] md:h-14 mx-auto object-contain 
        grayscale transition-transform duration-300 ease-in-out hover:grayscale-0 "/>
        <img draggable="false" src={hublogo} alt="Trusted Brand 3" 
        className="w-[178px] md:w-80 h-[31px] md:h-14 mx-auto object-contain 
        grayscale transition-transform duration-300 ease-in-out hover:grayscale-0" />
      </div>
    </div>
  );
};

export default TrustedBy;
