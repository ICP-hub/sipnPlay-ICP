import React, { useEffect, useState } from "react";
import userProfilePic from "../../assets/images/DefaultUserPic.svg";
import { useAuth } from "../../utils/useAuthClient";
import Crown from "../../assets/images/Crown.svg";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import AnimationButton from "../../common/AnimationButton";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

const LeaderBoardList = ({ game, isGameOver }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { backendActor } = useAuth();
  const [tetrisLeaderboard, setTetrisLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(0);
  const navigate = useNavigate();

  const fetchLeaderboard = async (gameName) => {
    try {
      setIsLoading(true);
      if (gameName === "Tetris") {
        const [leaderboard, userRank] =
          await backendActor.get_tetris_leaderboard();
        console.log("Tetris Leaderboard: ", leaderboard);
        console.log("User Rank: ", userRank.toString());
        if (leaderboard.Err) {
          console.error("Error fetching Tetris Leaderboard", leaderboard.Err);
        } else {
          if (leaderboard.Ok) {
            setTetrisLeaderboard(leaderboard.Ok);
            setUserRank(Number(userRank.toString()));
          }
        }
      } else {
        return;
      }
    } catch (error) {
      console.error("Error fetching Tetris Leaderboard:", error);
      toast.error("Error fetching Tetris Leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(game.name);
  }, []);

  return (
    <>
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
        className={`${
          isGameOver ? "border-none" : "md:border-l-2 border-white md:ps-16"
        } overflow-y-auto max-h-[70vh]`}
      >
        <div className="absolute left-12 -top-4 ">
        {isGameOver && (
          <div className="flex mt-12 items-end justify-center">
            <div></div>
            <AnimationButton>
              <div
                className="cursor-pointer flex items-center text-[12px] md:text-[17px] font-adam gap-4 justify-center"
                onClick={() => navigate("/")}
              >
                <AiFillHome size={21} />Back to home
              </div>
            </AnimationButton>
          </div>
        )}

        </div>
        <h3 className="text-center mx-[9%] mb-4 font-monckeberg text-xl">
          Leaderboard
        </h3>
        <p className="font-[500] font-adam mb-32  text-center">
          <span className="font-[900]">NOTE : </span>The leaderboard updates
          every 30 minutes.{" "}
        </p>
        <div className="flex justify-evenly">
          {tetrisLeaderboard.length === 0 ? (
            <p>No users in the leaderboard yet.</p>
          ) : (
            <>
              <div className="h-[132px] w-full mt-auto relative text-center pt-[45px] border border-[#EE3EC9]">
                <img
                  className="absolute rounded-full h-[60px] -top-8 left-[35%] border-[4px] border-gray-200"
                  src={userProfilePic}
                />
                {tetrisLeaderboard.length >= 2 && tetrisLeaderboard[1] ? (
                  <>
                    <p className="font-adam font-[600]">
                      {tetrisLeaderboard[1].owner.toText().slice(0, 5)}
                    </p>
                    <p className="font-adam">
                      {tetrisLeaderboard[1].points} pts
                    </p>
                  </>
                ) : (
                  "-"
                )}
              </div>

              <div className="h-[172px] w-full relative text-center pt-[45px] border border-[#EE3EC9]">
                <div>
                  <img
                    className="absolute rounded-full h-[90px] -top-12 left-[29%] border-[4px] border-yellow-400 "
                    src={userProfilePic}
                  />
                  <img
                    className="absolute h-[90px] -top-28 left-[29%]"
                    src={Crown}
                  />
                  {tetrisLeaderboard.length >= 1 && tetrisLeaderboard[0] ? (
                    <>
                      <p className="font-adam mt-8 font-[600]">
                        {tetrisLeaderboard[0].owner.toText().slice(0, 5)}
                      </p>
                      <p className="font-adam">
                        {tetrisLeaderboard[0].points} pts
                      </p>
                    </>
                  ) : (
                    "-"
                  )}
                </div>
              </div>

              <div className="h-1/2 w-full mt-auto relative text-center pt-8 border border-[#EE3EC9]">
                <img
                  className="absolute rounded-full h-[60px] -top-8 left-[35%] border-[4px] border-[#cd7f32] "
                  src={userProfilePic}
                />
                {tetrisLeaderboard.length >= 3 && tetrisLeaderboard[2] ? (
                  <>
                    <p className="font-adam font-[600]">
                      {tetrisLeaderboard[2].owner.toText().slice(0, 5)}
                    </p>
                    <p className="font-adam">
                      {tetrisLeaderboard[2].points} pts
                    </p>
                  </>
                ) : (
                  "-"
                )}
              </div>
            </>
          )}
        </div>
        <div className="overflow-auto max-h-[400px]">
          {" "}
          {/* Added scroll */}
          <ul>
            {tetrisLeaderboard[userRank - 1] && (
              <li
                key={tetrisLeaderboard[userRank - 1].owner.toText().slice(0, 5)}
                className={`flex items-center bg-opacity-20 bg-white justify-between p-4 my-4 border-2 border-[#ee3ec9]`}
              >
                <div className="flex items-center">
                  <span className="text-sm mr-2"># {userRank}</span>
                  <img
                    src={userProfilePic}
                    alt={tetrisLeaderboard[userRank - 1].owner
                      .toText()
                      .slice(0, 5)}
                    className="h-8 rounded-full mr-2"
                  />
                  <span className="text-sm">
                    {tetrisLeaderboard[userRank - 1].owner.toText().slice(0, 5)}
                  </span>
                </div>
                <span className="text-sm text-end">
                  {tetrisLeaderboard[userRank - 1].points} pts.
                </span>
              </li>
            )}
            <>
              {tetrisLeaderboard.map((user, index) => {
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
                    key={JSON.stringify(user.owner.toText().slice(0, 5))}
                    className={`flex items-center justify-between p-4 my-4 ${borderClass}`}
                  >
                    <div className="flex items-center">
                      <span className="text-sm mr-2"># {index + 1}</span>
                      <img
                        src={userProfilePic}
                        alt={JSON.stringify(user.owner.toText().slice(0, 5))}
                        className="h-8 rounded-full mr-2"
                      />
                      <span className="text-sm">
                        {user.owner.toText().slice(0, 5)}
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
    </>
  );
};
export default LeaderBoardList;
