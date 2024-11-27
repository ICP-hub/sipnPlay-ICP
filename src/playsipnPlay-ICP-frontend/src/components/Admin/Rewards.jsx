import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import Modal from "react-modal";
import RewardsLeaderboard from "./RewardsLeaderboard";
import AdminRewardModal from "../Modals/AdminRewardModal";

const Rewards = () => {
  const [activeLink, setActiveLink] = useState("tetris");
  const [isResetModalOpen, setisResetModalOpen] = useState(false);
  const [isRewardModalOpen, setisRewardModalOpen] = useState(false);
  const [isResetting, setisResetting] = useState(false);
  const [isRewarding, setisRewarding] = useState(false);

  function handleLinkClick(section) {
    setActiveLink(section);
  }
  return (
    <div className="flex flex-col font-adamMed font-semibold md:flex-row">
      <div className="flex-col bg-white bg-opacity-15 rounded-2xl text-center border-r-2 border-[#696969] items-center justify-center min-w-64 ">
        <div className="hover:bg-stone-600 rounded-2xl py-3 cursor-pointer transition-colors duration-300">
          Tetris
        </div>
      </div>
      <div className="flex flex-col items-center flex-1 mt-8 md:mt-0">
        <button
          onClick={() => setisResetModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 mb-2 transition-colors duration-300"
        >
          Reset Leaderboard
        </button>
        <p className="text-center text-sm mb-10">
          NOTE - Resetting the leaderboard will remove all the users and their
          points from the leaderboard table. This action can't be undone!
        </p>
        <AdminRewardModal
          isOpen={isResetModalOpen}
          closeModal={() => setisResetModalOpen(false)}
          header={"Reset Leaderboard?"}
          description={
            "Are you sure you want to reset the Leaderboard? This action CANNOT be undone!"
          }
          primaryBtnText={"Reset"}
          isInProcess={isResetting}
          btnColour={"red"}
        />
        <div className="w-3/4">
          <RewardsLeaderboard
            topTen={[
              {
                principal: "b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5",
                points: 100,
              },
              {
                principal: "iuewfiw-wefhwe-fhejfq-dwedfcs",
                points: 100,
              },
              {
                principal: "eifhsif-21no1jb4i12-12h1kj4141",
                points: 100,
              },
              {
                principal: "fwijeohfw-wefhwooeif-13rfjkwenfo1",
                points: 100,
              },
              {
                principal: "sarayu-prodduturu",
                points: 100,
              },
              {
                principal: "arayu-prodduturu",
                points: 100,
              },
              {
                principal: "rayu-prodduturu",
                points: 100,
              },
            ]}
          />
        </div>
        <button
          onClick={() => setisRewardModalOpen(true)}
          className={`px-4 py-2 bg-green-600 hover:bg-green-500 transition-colors duration-300 text-white rounded-md cursor-pointer ${
            isRewarding && "opacity-50 hover:cursor-not-allowed"
          }`}
        >
          Reward Users
        </button>
        <AdminRewardModal
          isOpen={isRewardModalOpen}
          closeModal={() => setisRewardModalOpen(false)}
          header={"Reward Users?"}
          description={
            "Are you sure you want to transfer tokens to the respective principals?"
          }
          primaryBtnText={"Reward"}
          isInProcess={isRewarding}
          btnColour={"green"}
        />
      </div>
    </div>
  );
};

export default Rewards;
