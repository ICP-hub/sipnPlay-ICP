import React from "react";
import logo from "../../assets/images/logo.png";
import bgImage from "../../assets/images/waitlistBg.png";
import blackJackLogo from "../../assets/images/blackjack.png";
import "./DotLoader.css";

const LoadingWindow = () => {
  return (
    <div
      className="p-8 min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        className=" w-[100px] h-[25px] md:w-[160px] md:h-[50px] lg:w-[191px]"
        draggable="false"
        src={logo}
      />
      <div className="flex flex-col justify-center items-center md:h-[480px]">
        <img className="block" draggable="false" src={blackJackLogo} />
        <div className="loader flex justify-center">
          <div className="colored-dot"></div>
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
          <div className="dot dot-4"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingWindow;
