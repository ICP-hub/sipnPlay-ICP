import React from "react";
import logo from "../../assets/images/logo.png";
import bgImage from "../../assets/images/waitlistBg.png";
import blackJackLogo from "../../assets/images/blackjack.png";
import tetrisLogo from "../../assets/images/tetris.png";
import bubbleLogo from "../../assets/images/bubble.png";
import styles from "./LoadingWindow.module.css";
import blocktapLogo from "../../assets/images/blocktap.png";

const LoadingWindow = ({ gameName }) => {
  let gameImage = null;
  switch (gameName) {
    case "blackjack":
      gameImage = blackJackLogo;
      break;
    case "tetris":
      gameImage = tetrisLogo;
      break;
    case "infinity_bubble":
      gameImage = bubbleLogo;
      break;
    case "block_tap":
      gameImage = blocktapLogo;
      break;
    default:
      gameImage = logo;
  }

  return (
    <div
      className="p-4 h-screen flex flex-col"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="h-16 md:h-24">
        <img
          className="h-full w-auto object-contain"
          draggable="false"
          src={logo}
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        <img
          className="h-32 sm:h-48 md:h-64 w-auto object-contain"
          draggable="false"
          src={gameImage}
        />
        {/* Loader */}
        <div className="loader flex justify-center items-center">
          <div className={`${styles.coloredDot}`}></div>
          <div className={`${styles.dot} ${styles.dot1}`}></div>
          <div className={`${styles.dot} ${styles.dot2}`}></div>
          <div className={`${styles.dot} ${styles.dot3}`}></div>
          <div className={`${styles.dot} ${styles.dot4}`}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingWindow;