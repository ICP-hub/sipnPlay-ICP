import React from "react";
import userProfilePic from "../../assets/images/DefaultUserPic.svg";
import { Principal } from "@dfinity/principal";

const RewardsLeaderboard = ({ topTen, rewardTokens, setrewardTokens }) => {
  const handleUpdateTokens = (index, newValue, principal) => {
    try {
      const updatedTokens = [...rewardTokens];
      updatedTokens[index] = {
        ...updatedTokens[index],
        owner: Principal.fromText(principal),
        amount: Number(newValue),
      };
      setrewardTokens(updatedTokens);
    } catch (error) {
      console.error("Error updating tokens:", error);
    }
  };

  return (
    <ul>
      {topTen.length > 0 ? (
        topTen.map((user, index) => {
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
              className={`${borderClass} px-4 py-2 my-4`}
              key={user.principal}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm md:mr-4">{index + 1}</span>
                  <img
                    src={userProfilePic}
                    alt="User Profile"
                    className="h-4 md:h-8 rounded-full md:mr-4"
                  />
                  <p className="text-xs sm:text-sm text-start w-[100px] md:w-[202px] truncate">
                    {user.owner.toText()}
                  </p>
                </div>
                <input
                  type="number"
                  onChange={(e) =>
                    handleUpdateTokens(
                      index,
                      e.target.value,
                      user.owner.toText()
                    )
                  }
                  className="text-xs rounded-md px-2 py-1 ml-2 bg-stone-700 outline-none border-none ring-[#EE3EC9] focus:ring-[1px] text-white min-w-16 md:w-32 lg:w-64 placeholder:text-stone-300"
                  placeholder="Tokens to reward"
                />
                <span className="text-sm text-end">
                  {user.points > 0 ? user.points : 0} pts.
                </span>
              </div>
            </li>
          );
        })
      ) : (
        <p className="mb-8 text-sm text-center">No users in the leaderboard.</p>
      )}
    </ul>
  );
};

export default RewardsLeaderboard;
