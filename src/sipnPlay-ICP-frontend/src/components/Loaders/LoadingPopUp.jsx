import React from "react";
import logo from "../../assets/images/logo.png";
import blackJackLogo from "../../assets/images/blackjack.png";
import EBoolLogo from "../../assets/images/8bool.png";
import gamepadLogo from "../../assets/images/gamepadLoader.gif";
import Modal from "react-modal";
// import DotLoader from "./DotLoader";
import styles from "./LoadingPopup.module.css";

const LoadingPopUp = ({ gameName }) => {
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
    <Modal
      isOpen={true}
      contentLabel="Popup Modal"
      className="fixed inset-0 flex flex-col items-center justify-center py-8 overflow-hidden"
      overlayClassName="fixed z-[100] inset-0 bg-[#191919] bg-opacity-40 backdrop:filter backdrop-blur-md p-8"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={false}
    >
      <div className="bg-black w-[85%] py-[39px] bg-opacity-80 rounded-3xl">
        <img
          src={gameImage}
          alt=""
          className="w-[160px] mx-auto md:w-[240px] lg:w-[480px]"
        />
        <img
          src={gamepadLogo}
          alt=""
          className="w-[100px] md:w-[160px] mx-auto lg:w-[220px]"
        />
        <div className="flex justify-center items-center">
          <p className="text-white font-semibold text-3xl">Loading</p>
          {/* Loader */}
          <div className="loader flex justify-center mt-4">
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
