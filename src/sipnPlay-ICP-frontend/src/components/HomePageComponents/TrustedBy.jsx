import React from 'react';
import difinitylogo from '../../assets/images/difinityLogo.png';
import IClogo from "../../assets/images/IClogo.png";
import hublogo from "../../assets/images/hubsLogo.png";
import textoutline from "../../assets/images/textOutline.png";

const TrustedBy = () => {
  return (
    <div className="p-8 bg-black-100">
       {/* Background Image for Heading */}
       <div className="absolute inset-0 flex justify-center items-start mt-14 -z-10">
        <img
          src={textoutline}
          alt="outlines"
          className="w-56 h-22 object-cover"
        />
      </div>

      <h2 className="text-2xl font-bold font-adam text-center mb-[6%]">Trusted by</h2>
     
      <div className="grid grid-cols-3 gap-10 mx-[9%]">
        <img src={difinitylogo} alt="Trusted Brand 1" 
        className="w-40 h-20 object-contain mx-auto 
        grayscale transition-transform duration-300 ease-in-out hover:grayscale-0"  />
        <img src={IClogo} alt="Trusted Brand 2" 
        className="w-64 h-14 object-contain mx-auto
        grayscale transition-transform duration-300 ease-in-out hover:grayscale-0 "/>
        <img src={hublogo} alt="Trusted Brand 3" 
        className="w-80 h-14 object-contain mx-auto
        grayscale transition-transform duration-300 ease-in-out hover:grayscale-0" />
      </div>
    </div>
  );
};

export default TrustedBy;
