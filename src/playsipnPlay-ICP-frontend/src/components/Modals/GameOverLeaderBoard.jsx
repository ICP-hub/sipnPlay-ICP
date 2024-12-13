import React from "react";
import Modal from "react-modal";
import LeaderBoardList from "../LeaderboardList/LeaderboardList";
import bgImage from "../../assets/images/waitlistBg.png";
import { ImCross } from "react-icons/im";

const GameOverLeaderBoard = ({
  gameName,
  isGameOver,
  shouldShowCross,
  closeModal,
}) => {
  return (
    <Modal
      isOpen={isGameOver}
      onRequestClose={closeModal}
      contentLabel="GameOver Modal"
      className="fixed inset-0 flex items-center justify-center bg-transparent"
      overlayClassName="fixed z-[100] inset-0 bg-gray-800 bg-opacity-50"
    >
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="bg-black relative w-[90%] text-white h-[87%] lg:grid-cols-2 border border-[#696969] rounded-xl px-8 py-4 lg:px-16 lg:py-8 overflow-hidden font-semibold"
      >
        <div className="mx-auto">
          {" "}
          <LeaderBoardList game={gameName} isGameOver={isGameOver} />
        </div>
        {shouldShowCross && (
          <button
            onClick={closeModal}
            className="text-white absolute top-8 right-8"
          >
            <ImCross />
          </button>
        )}
      </div>
    </Modal>
  );
};

export default GameOverLeaderBoard;
