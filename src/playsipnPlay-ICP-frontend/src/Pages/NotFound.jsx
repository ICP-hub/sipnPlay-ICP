import React from "react";
import notFoundToy from "../assets/images/notFoundToy.png";
const NotFound = () => {
  return (
      <div className="font-adamMed text-center font-[700] my-[240px] md:my-[161px] ">
       
       <div className="flex justify-center leading-[130px] gap-4 text-[78px] md:text-[128px]"> 
        <div className="relative">
        <p>Ooopss</p>
        <img draggable="false" className="absolute h-[130px] md:h-auto -top-16 md:-top-24 -right-14" src={notFoundToy} />  
        </div>
        <span className="rotate-[30deg] ">!</span>
        <span className="rotate-[60deg] ">!</span> 
       
        </div>
       <p className="text-[199px] md:text-[254px] leading-[260px]">404</p>
       <p className="text-[29px] md:text-[32px]">Page Not Found</p>
      </div>

  );
};

export default NotFound;
