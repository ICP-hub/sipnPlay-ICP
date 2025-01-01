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
      className="p-8 min-h-screen flex flex-col justify-between"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div>
        <img
          className="max-h-fit aspect-auto object-cover"
          draggable="false"
          src={logo}
        />
      </div>
      <div className="flex flex-grow flex-col justify-center items-center">
        <img
          className="block min-h-[130px] sm:min-h-[201px] md:min-h-[320px] object-cover"
          draggable="false"
          src={gameImage}
        />
        {/* Loader */}
        <div className="loader flex justify-center items-center my-8">
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
