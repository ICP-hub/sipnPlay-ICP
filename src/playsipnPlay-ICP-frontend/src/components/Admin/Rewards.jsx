import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import RewardsLeaderboard from "./RewardsLeaderboard";
import AdminRewardModal from "../Modals/AdminRewardModal";
import { useAuth } from "../../utils/useAuthClient";
import { Principal } from "@dfinity/principal";

const Rewards = () => {
  const { backendActor } = useAuth();
  const [isResetModalOpen, setisResetModalOpen] = useState(false);
  const [isRewardModalOpen, setisRewardModalOpen] = useState(false);
  const [topTen, setTopTen] = useState([]);
  const [gameName, setGameName] = useState("Tetris");
  const [rewardTokens, setrewardTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPlayers = async () => {
    try {
      setIsLoading(true);
      const topTenUsers = await backendActor.get_top_ten_players(gameName);
      if (topTenUsers.Ok) {
        setTopTen(topTenUsers.Ok);

        setrewardTokens(
          topTenUsers.Ok?.map((user) => ({
            owner: Principal.fromText(user.owner.toText()),
            amount: 0,
          }))
        );
      } else {
        if (topTenUsers.Err === "No data found") {
          setTopTen([]);
        }
        console.log(topTenUsers.Err);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPlayers(gameName);
  }, [gameName]);

  function handleLinkClick(section) {
    setGameName(section);
  }
  return (
    <div className="flex flex-col font-adamMed font-semibold md:flex-row">
      <div className="flex-col bg-white bg-opacity-15 rounded-2xl text-center border-r-2 border-[#696969] items-center justify-center min-w-64 ">
        <div
          className={`hover:bg-stone-600  ${
            gameName === "Tetris" ? "bg-stone-600" : ""
          } rounded-2xl py-3 cursor-pointer transition-colors duration-300`}
          onClick={() => handleLinkClick("Tetris")}
        >
          Blox
        </div>
        <div
          className={`hover:bg-stone-600 ${
            gameName === "Infinity Bubble" ? "bg-stone-600" : ""
          } rounded-2xl py-3 cursor-pointer transition-colors duration-300`}
          onClick={() => handleLinkClick("Infinity Bubble")}
        >
          Infinity Bubble
        </div>
        <div
          className={`hover:bg-stone-600 ${
            gameName === "Block Tap" ? "bg-stone-600" : ""
          } rounded-2xl py-3 cursor-pointer transition-colors duration-300`}
          onClick={() => handleLinkClick("Block Tap")}
        >
          Block Tap
        </div>
      </div>
      {isLoading ? (
        <Oval
          color="#EE3EC9"
          secondaryColor="#fff"
          wrapperClass="flex mx-auto mt-24 justify-center"
          width={64}
          height={64}
        />
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 mt-8 md:mt-0">
          {topTen.length > 0 && (
            <>
              <button
                onClick={() => setisResetModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 mb-2 transition-colors duration-300"
              >
                Reset Leaderboard
              </button>
              <p className="text-center text-sm mb-10">
                NOTE - Resetting the leaderboard will remove all the users and
                their points from the leaderboard table. This action can't be
                undone!
              </p>
            </>
          )}
          <AdminRewardModal
            isOpen={isResetModalOpen}
            closeModal={() => setisResetModalOpen(false)}
            header={"Reset Leaderboard?"}
            description={
              "Are you sure you want to reset the Leaderboard? This action CANNOT be undone!"
            }
            primaryBtnText="Reset"
            btnColour={"red"}
            getPlayers={getPlayers}
            gameName={gameName}
          />
          <div className="w-3/4">
            <RewardsLeaderboard
              topTen={topTen}
              rewardTokens={rewardTokens}
              setrewardTokens={setrewardTokens}
            />
          </div>
          {topTen.length > 0 && (
            <button
              onClick={() => setisRewardModalOpen(true)}
              className={`px-4 py-2 bg-green-600 hover:bg-green-500 transition-colors duration-300 text-white rounded-md cursor-pointer`}
            >
              Reward Users
            </button>
          )}
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
      )}
    </div>
  );
};

export default Rewards;
