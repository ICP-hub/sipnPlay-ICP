import React, { useEffect, useState } from "react";
import userProfilePic from "../../assets/images/DefaultUserPic.svg";
import { useAuth } from "../../utils/useAuthClient";
import Crown from "../../assets/images/Crown.svg";
import { Oval } from "react-loader-spinner";
import Modal from "react-modal";
import AnimationButton from "../../common/AnimationButton";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import useDisableScroll from "../../../../sipnPlay-ICP-frontend/src/utils/useDisableScroll";
import bgImage from "../../assets/images/waitlistBg.png";
import { ImCross } from "react-icons/im";

const LeaderBoardList = ({
  game,
  isGameOver,
  showLeaderboard,
  setShowLeaderboard,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { backendActor } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(0);
  const navigate = useNavigate();
  useDisableScroll(showLeaderboard);

  const fetchLeaderboard = async (gameName) => {
    try {
      setIsLoading(true);
      const [leaderboardResult, userRankResult] = await backendActor.get_leaderboard(
        gameName
      );
      
      if (leaderboardResult.Err) {
        console.error("Error fetching Leaderboard", leaderboardResult.Err);
      } else if (leaderboardResult.Ok) {
        setLeaderboard(leaderboardResult.Ok);
        setUserRank(Number(userRankResult.toString()));
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (game?.name) {
      fetchLeaderboard(game.name);
    }
  }, [game?.name, isGameOver]);

  return (
    <Modal
      isOpen={showLeaderboard}
      contentLabel="Leaderboard Modal"
      className="fixed inset-4 md:inset-8 lg:inset-12 rounded-xl flex items-center justify-center bg-transparent"
      overlayClassName="fixed z-[100] inset-0 bg-gray-800 backdrop-filter backdrop-blur-sm rounded-lg bg-opacity-50"
    >
      {isLoading && (
        <Oval
          color="#ee3ec9"
          secondaryColor="#fff"
          height={48}
          width={48}
          wrapperClass="flex justify-center items-center"
        />
      )}
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
        className="overflow-y-auto w-full max-w-4xl mx-auto max-h-[90vh] md:max-h-[80vh] rounded-lg p-3 md:p-8 lg:p-16 relative"
      >
        {!isGameOver && (
          <ImCross
            className="top-4 right-4 md:top-6 md:right-6 cursor-pointer absolute"
            onClick={() => setShowLeaderboard(false)}
          />
        )}
        <div className="absolute left-4 md:left-8 lg:left-12 -top-4">
          {isGameOver && (
            <div className="flex mt-8 md:mt-12 items-end justify-center">
              <div className="hidden lg:block">
                <AnimationButton>
                  <div
                    className="cursor-pointer flex items-center text-[12px] md:text-[17px] font-adam gap-2 md:gap-4 justify-center"
                    onClick={() => navigate("/")}
                  >
                    <AiFillHome size={21} />
                    <p>Back to home</p>
                  </div>
                </AnimationButton>
              </div>
              <div className="block lg:hidden">
                <div
                  className="cursor-pointer flex items-center text-[12px] md:text-[17px] font-adam gap-2 justify-center"
                  onClick={() => navigate("/")}
                >
                  <AiFillHome size={24} md:size={32} />
                </div>
              </div>
            </div>
          )}
        </div>
        <h3 className="text-center mx-[5%] md:mx-[9%] mb-2 md:mb-4 font-monckeberg text-lg md:text-xl mt-6 md:mt-8">
          Leaderboard
        </h3>
        <p className="font-[500] font-adam mb-16 md:mb-24 lg:mb-28 text-sm md:text-base text-center">
          <span className="font-[900]">NOTE : </span>The leaderboard updates
          every 2 minutes.
        </p>
        <div className="flex justify-evenly h-[150px] md:h-[180px] lg:h-[202px]">
          {leaderboard.length === 0 ? (
            <p>No users in the leaderboard yet.</p>
          ) : (
            <>
              <div className="h-3/4 w-full mt-auto relative text-center border border-[#EE3EC9]">
                <img
                  className="h-[40px] md:h-[50px] lg:h-[60px] absolute rounded-full left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 border-[3px] md:border-[4px] border-gray-200"
                  src={userProfilePic}
                />
                <div className="mt-8 md:mt-12 lg:mt-14 text-xs md:text-sm lg:text-base px-1 md:px-2">
                  {leaderboard.length >= 2 && leaderboard[1] ? (
                    <>
                      <p className="font-adam font-[600] truncate max-w-[60px] md:max-w-[70px] lg:max-w-[90px] mx-auto">
                        {leaderboard[1].owner.toText()}
                      </p>
                      <p className="font-adam text-[10px] md:text-xs">
                        {leaderboard[1].points} pts
                      </p>
                    </>
                  ) : (
                    "-"
                  )}
                </div>
              </div>

              <div className="h-full w-full relative text-center border border-[#EE3EC9]">
                <div>
                  <img
                    className="h-[40px] md:h-[50px] lg:h-[60px] absolute rounded-full left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 border-[3px] md:border-[4px] border-yellow-400"
                    src={userProfilePic}
                  />
                  <img
                    className="absolute h-[40px] md:h-[50px] lg:h-[60px] left-1/2 -top-1/4 transform -translate-x-1/2 -translate-y-1/2"
                    src={Crown}
                  />
                  <div className="mt-12 md:mt-16 lg:mt-20 text-xs md:text-sm lg:text-base px-1 md:px-2">
                    {leaderboard.length >= 1 && leaderboard[0] ? (
                      <>
                        <p className="font-adam font-[600] truncate max-w-[60px] md:max-w-[70px] lg:max-w-[90px] mx-auto">
                          {leaderboard[0].owner.toText()}
                        </p>
                        <p className="font-adam text-[10px] md:text-xs">
                          {leaderboard[0].points} pts
                        </p>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              <div className="h-1/2 w-full mt-auto relative text-center border border-[#EE3EC9]">
                <img
                  className="h-[40px] md:h-[50px] lg:h-[60px] absolute rounded-full left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 border-[3px] md:border-[4px] border-[#cd7f32]"
                  src={userProfilePic}
                />
                <div className="mt-8 md:mt-10 text-xs md:text-sm lg:text-base px-1 md:px-2">
                  {leaderboard.length >= 3 && leaderboard[2] ? (
                    <>
                      <p className="font-adam font-[600] truncate max-w-[60px] md:max-w-[70px] lg:max-w-[90px] mx-auto">
                        {leaderboard[2].owner.toText()}
                      </p>
                      <p className="font-adam text-[10px] md:text-xs">
                        {leaderboard[2].points} pts
                      </p>
                    </>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="overflow-y-auto max-h-[250px] md:max-h-[300px] lg:max-h-[400px]">
          {leaderboard[userRank - 1] && (
            <li
              key={leaderboard[userRank - 1].owner.toText().slice(0, 5)}
              className="flex items-center bg-opacity-20 bg-white justify-between p-2 md:p-4 my-2 md:my-4 border-2 border-[#ee3ec9]"
            >
              <div className="flex items-center">
                <span className="text-xs md:text-sm mr-1 md:mr-2"># {userRank}</span>
                <img
                  src={userProfilePic}
                  alt={leaderboard[userRank - 1].owner.toText()}
                  className="h-6 md:h-8 rounded-full mr-1 md:mr-2"
                />
                <span className="text-xs md:text-sm truncate max-w-[120px] md:max-w-[165px] lg:max-w-[239px]">
                  You
                </span>
              </div>
              <span className="text-xs md:text-sm text-end">
                {leaderboard[userRank - 1].points} pts.
              </span>
            </li>
          )}
          <>
            {leaderboard.map((user, index) => {
              let borderClass = "border-2 border-[#ee3ec9]";
              if (index === 0) borderClass = "border-2 border-[#ffd700]";
              else if (index === 1) borderClass = "border-2 border-[#c0c0c0]";
              else if (index === 2) borderClass = "border-2 border-[#cd7f32]";

              return (
                <li
                  key={JSON.stringify(user.owner.toText())}
                  className={`flex items-center justify-between p-2 md:p-4 my-2 md:my-4 ${borderClass}`}
                >
                  <div className="flex items-center">
                    <span className="text-xs md:text-sm mr-1 md:mr-2"># {index + 1}</span>
                    <img
                      src={userProfilePic}
                      alt={JSON.stringify(user.owner.toText())}
                      className="h-6 md:h-8 rounded-full mr-1 md:mr-2"
                    />
                    <span className="text-xs md:text-sm truncate max-w-[120px] md:max-w-[165px] lg:max-w-[239px]">
                      {user.owner.toText()}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm text-end">{user.points} pts.</span>
                </li>
              );
            })}
          </>
        </div>
      </div>
    </Modal>
  );
};

export default LeaderBoardList;