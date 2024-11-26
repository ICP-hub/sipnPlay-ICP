import React, { useState } from "react";
import userProfilePic from "../../assets/images/DefaultUserPic.svg";

const RewardsLeaderboard = ({ topTen }) => {
  const [userRank, setUserRank] = useState(0);
  const [rewardTokens, setrewardTokens] = useState("");
  return (
    <ul>
      {topTen.map((user, index) => {
        let borderClass = "border-2 border-[#ee3ec9]"; // Default border color for 4th place and beyond

        if (index === 0) {
          borderClass = "border-2 border-[#ffd700]"; // Apply gold border to 1st place
        } else if (index === 1) {
          borderClass = "border-2 border-[#c0c0c0]"; // Apply silver border to 2nd place
        } else if (index === 2) {
          borderClass = "border-2 border-[#cd7f32]"; // Apply bronze border to 3rd place
        }
        return (
          <li className={`${borderClass} px-4 py-2 my-4`} key={user.principal}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm md:mr-4">{index + 1}</span>
                <img
                  src={userProfilePic}
                  alt="User Profile"
                  className="h-4 md:h-8 rounded-full md:mr-4"
                />
                <p className="text-xs sm:text-sm text-start w-[100px] md:w-[202px] truncate">
                  {user.principal}
                </p>
              </div>
              <input
                type="number"
                value={rewardTokens}
                onChange={(e) => setrewardTokens(e.target.value)}
                className="text-xs rounded-md px-2 py-1 ml-2 bg-stone-700 outline-none border-none focus:ring ring-[#EE3EC9] text-white min-w-16 md:w-32"
                placeholder="Tokens to reward"
              />
              <span className="text-sm text-end">
                {user.points > 0 ? user.points : 0} pts.
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default RewardsLeaderboard;
