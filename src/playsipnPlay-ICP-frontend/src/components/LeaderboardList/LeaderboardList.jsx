import React, { useEffect, useState } from "react";
import userProfilePic from "../../assets/images/DefaultUserPic.svg";
import { useAuth } from "../../utils/useAuthClient";
import Crown from "../../assets/images/Crown.svg";

const LeaderBoardList = ({ game }) => {
  const { backendActor } = useAuth();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [tetrisLeaderboard, setTetrisLeaderboard] = useState([]);

  const fetchTetrisLeaderboard = async () => {
    try {
      const leaderboardResponse = await backendActor.get_tetris_leaderboard();
      const userleaderboardResponse = await backendActor.get_logged_in_user_leaderboard();
      console.log("Tetris Leaderboard: ", leaderboardResponse);
      console.log("User Tetris Leaderboard: ", userleaderboardResponse);
      if (leaderboardResponse.Err) {
        console.error("Error fetching Tetris Leaderboard", leaderboardResponse.Err);
        toast.error("Error fetching Tetris Leaderboard");
        return
      } else {
        if (leaderboardResponse.Ok) {
          setTetrisLeaderboard(leaderboardResponse.Ok);
        }
      }
      if (userleaderboardResponse.Err) {
        console.error("Error fetching User Tetris Leaderboard:", userleaderboardResponse.Err);
        toast.error("Error fetching User Tetris Leaderboard");
        return
      } else {
        if (userleaderboardResponse.Ok) {
          setLoggedInUser(userleaderboardResponse.Ok);
        } else {
          setLoggedInUser(null);
        }
      }
    } catch (error) {
      console.error("Error fetching Tetris Leaderboard:", error);
      toast.error("Error fetching Tetris Leaderboard");
    }
  }

  useEffect(() => {
    fetchTetrisLeaderboard();
  }, []);

  return (
    <div className="border-l-2 border-white ps-16 overflow-y-auto max-h-[70vh]">
      <h3 className="text-center mx-[9%] mb-32 font-monckeberg text-xl">
        Leaderboard
      </h3>
      <div className="flex justify-evenly">
        {tetrisLeaderboard[1] && (
          <div className="h-[132px] w-full mt-auto relative text-center pt-[45px] border border-[#EE3EC9]">
            <img
              className="absolute rounded-full h-[60px] -top-8 left-[35%] border-[4px] border-gray-200"
              src={userProfilePic}
            />
            <p className="font-adam font-[600]">{tetrisLeaderboard[1].owner.toText().slice(0, 5)}</p>
            <p className="font-adam">{tetrisLeaderboard[1].score}</p>
          </div>
        )}
        {tetrisLeaderboard[0] && (
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
              <p className="font-adam mt-8 font-[600]">{tetrisLeaderboard[0].owner.toText().slice(0, 5)}</p>
              <p className="font-adam">{tetrisLeaderboard[0].score}</p>
            </div>
          </div>
        )}
        {/* {tetrisLeaderboard[2] && (
      <div className="h-1/2 w-full mt-auto relative text-center pt-8 border border-[#EE3EC9]">
        <img
          className="absolute rounded-full h-[60px] -top-8 left-[35%] border-[4px] border-[#cd7f32] "
          src={userProfilePic}
        />
        <p className="font-adam font-[600]">{tetrisLeaderboard[2].rank}</p>
        <p className="font-adam">{tetrisLeaderboard[2].score}</p>
      </div>
      )} */}
      </div>
      <div className="overflow-auto max-h-[400px]">
        {" "}
        {/* Added scroll */}
        <ul>
          {tetrisLeaderboard.map((user, index) => {
            let borderClass = "border-2 border-[#ee3ec9]"; // Default border color for 4th place and beyond

            if (index === 0) {
              borderClass = "border-2 border-[#ffd700]"; // Apply gold border to 1st place
            } else if (index === 1) {
              borderClass = "border-2 border-[#c0c0c0]"; // Apply silver border to 2nd place
            } else if (index === 2) {
              borderClass = "border-2 border-[#cd7f32]"; // Apply bronze border to 3rd place
            }

            // Add return statement to render the <li> element
            return (
              <li
                key={JSON.stringify(user.owner.toText().slice(0, 5))}
                className={`flex items-center justify-between p-4 my-4 ${borderClass}`}
              >
                <div className="flex items-center">
                  <span className="text-sm mr-2">{index + 1}</span>
                  <img
                    src={userProfilePic}
                    alt={JSON.stringify(user.owner.toText().slice(0, 5))}
                    className="h-8 rounded-full mr-2"
                  />
                  <span className="text-sm">{user.owner.toText().slice(0, 5)}</span>
                </div>
                <span className="text-sm text-end">{user.score} pts.</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default LeaderBoardList;
