import React from "react";
import logo from "../../assets/images/logo.png";
import blackJackLogo from "../../assets/images/blackjack.png";
import EBoolLogo from "../../assets/images/8bool.png";
import gamepadLogo from "../../assets/images/gamepadLoader.gif";
import Modal from "react-modal";
import DotLoader from "./DotLoader";

const LoadingPopUp = ({ gameName, isPopUpLoading, setIsPopUpLoading }) => {
  function closePopUp() {
    setIsPopUpLoading(false);
  }
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
      onRequestClose={closePopUp}
      contentLabel="Popup Modal"
      className="fixed inset-0 flex flex-col items-center justify-center py-8 rounded-3xl overflow-hidden"
      overlayClassName="fixed z-[100] inset-x-12 inset-y-52 md:inset-y-16 md:inset-x-32 bg-[#191919] bg-opacity-80 backdrop:filter backdrop-blur-md  border-[#696969] p-8"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <img
        src={gameImage}
        alt=""
        className="w-[160px] md:w-[240px] lg:w-[480px]"
      />
      <img
        src={gamepadLogo}
        alt=""
        className="w-[100px] md:w-[160px] lg:w-[220px]"
      />
      <div className="flex items-center">
        <p className="text-white font-semibold text-5xl mb-8">Loading</p>
        <DotLoader dotSize={5} />
      </div>
    </Modal>
  );
};

export default LoadingPopUp;
