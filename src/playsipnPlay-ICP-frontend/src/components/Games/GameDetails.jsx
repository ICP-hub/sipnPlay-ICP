import React from "react";
import logo from "../../assets/images/logo.png";
import AnimationButton from "../../common/AnimationButton";
import Modal from "react-modal";
import bgImage from "../../assets/images/waitlistBg.png";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import useDisableScroll from "../../../../sipnPlay-ICP-frontend/src/utils/useDisableScroll";
import LeaderBoardList from "../LeaderboardList/LeaderboardList";

const GameDetails = ({ modalIsOpen, closeModal, game, tokenomics }) => {
  const navigate = useNavigate();
  useDisableScroll(modalIsOpen);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Waitlist Modal"
      className="fixed inset-0 flex items-center justify-center bg-transparent"
      overlayClassName="fixed z-[100] inset-0 bg-gray-800 bg-opacity-50"
    >
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="bg-black w-[90%] text-white h-[87%] lg:grid-cols-2 border border-[#696969] rounded-xl px-8 py-4 lg:px-16 lg:py-8 overflow-hidden font-semibold"
      >
        <div className="flex justify-between items-center">
          <img
            className="w-[120px] md:w-[160px] lg:w-[191px]"
            draggable="false"
            src={logo}
          />
          <ImCross onClick={closeModal} className="cursor-pointer" />
        </div>
        <div
          className={`grid grid-cols-1 ${
            game.leaderboard ? "md:grid-cols-2" : ""
          }  gap-4 md:gap-8 mt-8 overflow-y-auto max-h-[70vh]`}
        >
          <div className="lg:pe-14 overflow-y-auto max-h-[70vh] pb-12 border-white">
            <div className="flex items-center justify-between mb-10 ">
              <div className="flex flex-col xl:flex-row justify-between items-center lg:mr-6">
                <img src={game.img} alt={game.name} className="h-[84px]" />
                {/* <h3 className="font-monckeberg text-xl">{game.name}</h3> */}
              </div>
              <AnimationButton onClick={() => navigate(game.link)}>
                <p className="font-adam">PLAY NOW</p>
              </AnimationButton>
            </div>
            <div className="mb-12">
              <h4 className="font-monckeberg mb-4">HOW TO PLAY:</h4>
              <p className="font-adam text-white text-sm">{game.controls}</p>
            </div>
            <div className="mb-12">
              <p className="font-monckeberg mb-4">ABOUT GAME:</p>
              <ol className="font-adam text-white text-sm">
                {game.description.map((item, i) => (
                  <li key={i}>
                    <span>{i}) </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="font-monckeberg mb-4">TOKENOMICS:</p>
              <p className="font-adam text-white text-sm">{tokenomics}</p>
            </div>
          </div>
          {game.leaderboard && (
            <LeaderBoardList game={game} isGameOver={false} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default GameDetails;
