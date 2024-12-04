import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import Modal from "react-modal";
import RewardsLeaderboard from "./RewardsLeaderboard";
import AdminRewardModal from "../Modals/AdminRewardModal";
import { useAuth } from "../../utils/useAuthClient";

const Rewards = () => {
  const [activeLink, setActiveLink] = useState("tetris");
  const { backendActor } = useAuth();
  const [isResetModalOpen, setisResetModalOpen] = useState(false);
  const [isRewardModalOpen, setisRewardModalOpen] = useState(false);
  const [topTen, setTopTen] = useState([]);
  const [rewardTokens, setrewardTokens] = useState(
    Array.from({ length: topTen.length }, () => ({ principal: "", amount: 0 }))
  );

  const getTetrisPlayers = async () => {
    const topTenUsers = await backendActor.get_top_ten_players();
    setTopTen(topTenUsers.Ok);
  }
  useEffect(() => {
    if (activeLink === "tetris") {
      getTetrisPlayers();
    }
  }, []);

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
            "Are you sure you  want to reset the Leaderboard? This action CANNOT be undone!"
          }
          primaryBtnText="Reset"
          btnColour={"red"}
          getTetrisPlayers={getTetrisPlayers}
        />
        <div className="w-3/4">
          <RewardsLeaderboard
            topTen={topTen}
            rewardTokens={rewardTokens}
            setrewardTokens={setrewardTokens}
          />
        </div>
        <button
          onClick={() => setisRewardModalOpen(true)}
          className={`px-4 py-2 bg-green-600 hover:bg-green-500 transition-colors duration-300 text-white rounded-md cursor-pointer`}
        >
          Reward Users
        </button>
        <AdminRewardModal
          isOpen={isRewardModalOpen}
          closeModal={() => setisRewardModalOpen(false)}
          header={"Reward Users"}
          description={
            "Are you sure you want to transfer tokens to the respective principals?"
          }
          primaryBtnText="Reward"
          btnColour={"green"}
          rewardTokens={rewardTokens}

        />
      </div>
    </div>
  );
};

export default Rewards;
