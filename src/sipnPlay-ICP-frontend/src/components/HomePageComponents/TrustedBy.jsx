import React from 'react';
import difinitylogo from '../../assets/images/difinityLogo.png';
import IClogo from "../../assets/images/IClogo.png";
import hublogo from "../../assets/images/hubsLogo.png";
import textoutline from "../../assets/images/textOutline.png";

const TrustedBy = () => {
  return (
    <div className="md:p-8 mb-12 md:mb-20 bg-black-100">
       <div className="relative inset-0 flex justify-center items-start mt-3 md:mt-14 mb-[34px] -z-10">
        <img
          src={textoutline}
          alt="outlines"
          className="h-[84px] md:w-56 w-[161px] md:h-22"
        />
        <h2 className="text-[24px] md:text-2xl absolute top-4 md:top-8 font-bold font-adam text-center mb-[6%]">Trusted by</h2>
      </div>

      <div className="flex items-center md:justify-between gap-4 md:gap-10 md:mx-[9%]">
        <img draggable="false" src={difinitylogo} alt="Trusted Brand 1" 
        className="w-[76px] md:w-[112px] lg:w-40 md:h-[58px] lg:h-20 mx-auto object-contain  
        md:grayscale transition-transform duration-300 ease-in-out  md:hover:grayscale-0"  />
        <img draggable="false" src={IClogo} alt="Trusted Brand 2" 
        className="w-[130px] md:w-[181px] lg:w-64 md:h-[37px] lg:h-14 mx-auto object-contain 
        md:grayscale transition-transform duration-300 ease-in-out md:hover:grayscale-0 "/>
        <img draggable="false" src={hublogo} alt="Trusted Brand 3" 
        className="w-[120px] md:w-[178px] lg:w-80  md:h-[31px] lg:h-14 mx-auto object-contain 
        md:grayscale transition-transform duration-300 ease-in-out  md:hover:grayscale-0" />
      </div>
    </div>
  );
};

export default TrustedBy;
