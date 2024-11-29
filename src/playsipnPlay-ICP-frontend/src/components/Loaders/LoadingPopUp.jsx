import React from "react";
import logo from "../../assets/images/logo.png";
import blackJackLogo from "../../assets/images/blackjack.png";
import tetrisLogo from "../../assets/images/tetris.png";
import gamepadLogo from "../../assets/images/gamepadLoader.gif";
import Modal from "react-modal";
import styles from "./LoadingPopup.module.css";

const LoadingPopUp = ({ gameName, taskName }) => {
  let gameImage = null;
  switch (gameName) {
    case "blackjack":
      gameImage = blackJackLogo;
      break;
    case "tetris":
      gameImage = tetrisLogo;
      break;
    default:
      gameImage = logo;
  }
  return (
    <Modal
      isOpen={true}
      contentLabel="Popup Modal"
      className="fixed inset-0 flex flex-col items-center justify-center py-8 overflow-hidden"
      overlayClassName="fixed z-[100] inset-0 bg-[#191919] bg-opacity-40 backdrop:filter backdrop-blur-md p-8"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={false}
    >
      <div className="bg-black w-[85%] py-[39px] bg-opacity-80 rounded-3xl min-h-[260px] md:min-h-[400px] lg:min-h-[700px]">
        <div className="min-h-[160px] md:min-h-[240px] lg:min-h-[360px] mb-4">
          <img
            src={gameImage}
            alt=""
            className="h-[160px] mx-auto md:h-[240px] lg:h-[360px] mb-4"
          />
        </div>
        <div className="min-h-[100px] md:min-h-[160px] mx-auto lg:min-h-[180px] mb-4">
          <img
            src={gamepadLogo}
            alt=""
            className="h-[100px] md:h-[160px] mx-auto lg:h-[180px] mb-4"
          />
        </div>
        <div className="flex justify-center items-center">
          <p className="text-white font-semibold text-3xl">{taskName}</p>
          {/* Loader */}
          <div className="loader flex justify-center place-self-end mb-2">
            <div className={`${styles.coloredDot}`}></div>
            <div className={`${styles.dot} ${styles.dot1}`}></div>
            <div className={`${styles.dot} ${styles.dot2}`}></div>
            <div className={`${styles.dot} ${styles.dot3}`}></div>
            <div className={`${styles.dot} ${styles.dot4}`}></div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoadingPopUp;
