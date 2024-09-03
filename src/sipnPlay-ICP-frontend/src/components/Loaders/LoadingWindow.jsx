import React from "react";
import logo from "../../assets/images/logo.png";
import bgImage from "../../assets/images/waitlistBg.png";
import blackJackLogo from "../../assets/images/blackjack.png";
import EBoolLogo from "../../assets/images/8bool.png";
import "./DotLoader.css";

const LoadingWindow = ({ gameName }) => {
  let gameImage = null;
  switch (gameName) {
    case "blackjack":
      gameImage = blackJackLogo;
      break;
    case "BallPool":
      gameImage = EBoolLogo;
      break;
    default:
      gameImage = logo;
  }
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
        className=" w-[88px] md:w-[130px] lg:w-[160px]"
        draggable="false"
        src={logo}
      />
      <div className="flex flex-col justify-center items-center md:h-[480px]">
        <img className="block" draggable="false" src={gameImage} />
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
