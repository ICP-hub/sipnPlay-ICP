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
      console.log("Fetching leaderboard for game:", gameName); // Debug log

      const [leaderboardResult, userRankResult] = await backendActor.get_leaderboard(
        gameName
      );
      
      console.log("Leaderboard response:", leaderboardResult); // Debug log
      console.log("User rank response:", userRankResult); // Debug log

      if (leaderboardResult.Err) {
        console.error("Error fetching Leaderboard", leaderboardResult.Err);
      } else if (leaderboardResult.Ok) {
        console.log("Setting leaderboard data:", leaderboardResult.Ok); // Debug log
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

  // Add effect dependency on isGameOver
  useEffect(() => {
    if (game?.name) {
      console.log("Fetching leaderboard on mount or game over:", game.name); // Debug log
      fetchLeaderboard(game.name);
    }
  }, [game?.name, isGameOver]); // Refetch when game ends


  return (
    <Modal
      isOpen={showLeaderboard}
      contentLabel="Leaderboard Modal"
      className="fixed inset-4 rounded-xl flex items-center justify-center bg-transparent"
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
        className={`overflow-y-auto max-h-[70vh] rounded-lg p-4 md:p-16 relative`}
      >
        {!isGameOver && (
          <ImCross
            className="top-6 right-6 cursor-pointer absolute"
            onClick={() => setShowLeaderboard(false)}
          />
        )}
        <div className="absolute left-12 -top-4 ">
          {isGameOver && (
            <div className="flex mt-12 items-end justify-center">
              <div></div>
              <div className="hidden lg:block">
                <AnimationButton>
                  <div
                    className="cursor-pointer flex items-center text-[12px] md:text-[17px] font-adam gap-4 justify-center"
                    onClick={() => navigate("/")}
                  >
                    <AiFillHome size={21} />
                    <p>Back to home</p>
                  </div>
                </AnimationButton>
              </div>
              <div className="block lg:hidden">
                <div
                  className="cursor-pointer flex items-center text-[12px] md:text-[17px] font-adam gap-4 justify-center"
                  onClick={() => navigate("/")}
                >
                  <AiFillHome size={32} />
                </div>
              </div>
            </div>
          )}
        </div>
        <h3 className="text-center mx-[9%] mb-4 font-monckeberg text-xl mt-8">
          Leaderboard
        </h3>
        <p className="font-[500] font-adam mb-24 md:mb-28  text-center">
          <span className="font-[900]">NOTE : </span>The leaderboard updates
          every 2 minutes.{" "}
        </p>
        <div className="flex justify-evenly h-[202px]">
          {leaderboard.length === 0 ? (
            <p>No users in the leaderboard yet.</p>
          ) : (
            <>
              <div className="h-3/4 w-full mt-auto relative text-center border border-[#EE3EC9]">
                <img
                  className=" h-[60px] lg:h-[60px] absolute rounded-full left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 border-[4px] border-gray-200"
                  src={userProfilePic}
                />
                <div className="mt-14 text-sm md:text-base px-2 truncate max-w-[70px] lg:max-w-[90px] mx-auto">
                  {leaderboard.length >= 2 && leaderboard[1] ? (
                    <>
                      <p className="font-adam font-[600] mx-auto ">
                        {leaderboard[1].owner.toText()}
                      </p>
                      <p className="font-adam  text-xs">
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
                    className="h-[60px]  lg:h-[60px] absolute rounded-full left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 border-[4px] border-yellow-400"
                    src={userProfilePic}
                  />
                  <img
                    className="absolute h-[60px] left-1/2 -top-1/4 transform -translate-x-1/2 -translate-y-1/2"
                    src={Crown}
                  />
                  <div className="mt-20 text-sm md:text-base px-2 truncate max-w-[70px] lg:max-w-[90px] mx-auto">
                    {leaderboard.length >= 1 && leaderboard[0] ? (
                      <>
                        <p className="font-adam font-[600] mx-auto truncate">
                          {leaderboard[0].owner.toText()}
                        </p>
                        <p className="font-adam text-xs">
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
                  className="h-[60px]  lg:h-[60px] absolute rounded-full  left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 border-[4px] border-[#cd7f32]"
                  src={userProfilePic}
                />
                <div className="mt-10 text-sm md:text-base px-2 truncate max-w-[70px] lg:max-w-[90px] mx-auto">
                  {leaderboard.length >= 3 && leaderboard[2] ? (
                    <>
                      <p className="font-adam font-[600] mx-auto truncate">
                        {leaderboard[2].owner.toText()}
                      </p>
                      <p className="font-adam text-xs">
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
        <div className="overflow-y-auto max-h-[400px]">
          {" "}
          {/* Added scroll */}
          <ul>
            {leaderboard[userRank - 1] && (
              <li
                key={leaderboard[userRank - 1].owner.toText().slice(0, 5)}
                className={`flex items-center bg-opacity-20 bg-white justify-between p-4 my-4 border-2 border-[#ee3ec9]`}
              >
                <div className="flex items-center">
                  <span className="text-sm mr-2"># {userRank}</span>
                  <img
                    src={userProfilePic}
                    alt={leaderboard[userRank - 1].owner.toText()}
                    className="h-8 rounded-full mr-2"
                  />
                  <span className="text-sm truncate max-w-[165px] md:max-w-[239px]">
                    You
                  </span>
                </div>
                <span className="text-sm text-end">
                  {leaderboard[userRank - 1].points} pts.
                </span>
              </li>
            )}
            <>
              {leaderboard.map((user, index) => {
                let borderClass = "border-2 border-[#ee3ec9]"; // Default border color for 4th place and beyond

                if (index === 0) {
                  borderClass = "border-2 border-[#ffd700]"; // Apply gold border to 1st place
                } else if (index === 1) {
                  borderClass = "border-2 border-[#c0c0c0]"; // Apply silver border to 2nd place
                } else if (index === 2) {
                  borderClass = "border-2 border-[#cd7f32]"; // Apply bronze border to 3rd place
                }

                return (
                  <li
                    key={JSON.stringify(user.owner.toText())}
                    className={`flex items-center justify-between p-4 my-4 ${borderClass}`}
                  >
                    <div className="flex items-center">
                      <span className="text-sm mr-2"># {index + 1}</span>
                      <img
                        src={userProfilePic}
                        alt={JSON.stringify(user.owner.toText())}
                        className="h-8 rounded-full mr-2"
                      />
                      <span className="text-sm truncate max-w-20 md:max-w-32 lg:max-w-48">
                        {user.owner.toText()}
                      </span>
                    </div>
                    <span className="text-sm text-end">{user.points} pts.</span>
                  </li>
                );
              })}
            </>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
export default LeaderBoardList;
