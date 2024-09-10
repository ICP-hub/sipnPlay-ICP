import React from "react";
import "./AnimationButton.css";

const HeaderButton = ({ children, onClick }) => {
  return (
    <>
      <button
        type="submit"
        onClick={onClick}
        className="border z-20 flex justify-evenly items-center text-white relative w-[120px] lg:w-[190px] h-[32px] lg:h-[48px] flip-card font-adam  text-[12px] md:text-[15px] font-[300] border-[#EE3EC9]"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.375 8.75H22.5V7.5C22.499 6.50574 22.1036 5.55249 21.4006 4.84945C20.6975 4.1464 19.7443 3.75099 18.75 3.75H5.625C4.7962 3.75 4.00134 4.07924 3.41529 4.66529C2.82924 5.25134 2.5 6.0462 2.5 6.875V22.5C2.50099 23.4943 2.8964 24.4475 3.59945 25.1506C4.30249 25.8536 5.25574 26.249 6.25 26.25H24.375C25.2038 26.25 25.9987 25.9208 26.5847 25.3347C27.1708 24.7487 27.5 23.9538 27.5 23.125V11.875C27.5 11.0462 27.1708 10.2513 26.5847 9.66529C25.9987 9.07924 25.2038 8.75 24.375 8.75ZM5.625 5H18.75C19.4127 5.00099 20.048 5.2647 20.5167 5.73333C20.9853 6.20195 21.249 6.83726 21.25 7.5V8.75H5.625C5.37877 8.75 5.13495 8.7015 4.90747 8.60727C4.67998 8.51305 4.47328 8.37494 4.29917 8.20083C4.12506 8.02672 3.98695 7.82002 3.89273 7.59253C3.7985 7.36505 3.75 7.12123 3.75 6.875C3.75 6.62877 3.7985 6.38495 3.89273 6.15747C3.98695 5.92998 4.12506 5.72328 4.29917 5.54917C4.47328 5.37506 4.67998 5.23695 4.90747 5.14273C5.13495 5.0485 5.37877 5 5.625 5ZM26.25 20H23.75C23.087 20 22.4511 19.7366 21.9822 19.2678C21.5134 18.7989 21.25 18.163 21.25 17.5C21.25 16.837 21.5134 16.2011 21.9822 15.7322C22.4511 15.2634 23.087 15 23.75 15H26.25V20ZM26.25 13.75H23.75C23.2575 13.75 22.7699 13.847 22.3149 14.0355C21.86 14.2239 21.4466 14.5001 21.0983 14.8483C20.7501 15.1966 20.4739 15.61 20.2855 16.0649C20.097 16.5199 20 17.0075 20 17.5C20 17.9925 20.097 18.4801 20.2855 18.9351C20.4739 19.39 20.7501 19.8034 21.0983 20.1517C21.4466 20.4999 21.86 20.7761 22.3149 20.9645C22.7699 21.153 23.2575 21.25 23.75 21.25H26.25V23.125C26.25 23.6223 26.0525 24.0992 25.7008 24.4508C25.3492 24.8025 24.8723 25 24.375 25H6.25C5.58726 24.999 4.95195 24.7353 4.48333 24.2667C4.0147 23.798 3.75099 23.1627 3.75 22.5V9.37375C4.29 9.78125 4.94875 10.0012 5.625 10H24.375C24.8723 10 25.3492 10.1975 25.7008 10.5492C26.0525 10.9008 26.25 11.3777 26.25 11.875V13.75Z"
            fill="white"
          />
        </svg>
        <span className="font-semibold tracking-wide">{children}</span>
        <div className="absolute h-[5px] w-[5px] -top-[1px] -left-[1px] border-t-[1px] border-l-[1px] "></div>
        <div className="absolute h-[5px] w-[5px] -top-[1px] -right-[1px] border-t-[1px] border-r-[1px] "></div>
        <div className="absolute h-[5px] w-[5px] -bottom-[1px] -left-[1px] border-b-[1px] border-l-[1px] "></div>
        <div className="absolute h-[5px] w-[5px] -bottom-[1px] -right-[1px] border-b-[1px] border-r-[1px] "></div>

        <div className="flip-card-inner absolute top-0 left-0 z-[-1] w-full h-[100%] text-center transition-all duration-700">
          <div className="flip-card-front absolute w-full h-full"></div>
          <div className="flip-card-back bg-[#EE3EC9] opacity-30 absolute w-full h-full"></div>
        </div>
      </button>
    </>
  );
};

export default HeaderButton;
