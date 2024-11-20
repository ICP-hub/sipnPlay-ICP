import React from "react";
import userProfilePic from "../../assets/images/DefaultUserPic.svg";

// const LeaderBoardTable = ({ data }) => {
//   return (
//     // <table className="shadow-lg rounded-lg my-4 overflow-y-auto scroll">
//     //   {/* <thead>
//     //       <tr className="bg-gray-100 text-gray-600">
//     //         <th className="px-4 py-2 text-left">Rank</th>
//     //         <th className="px-4 py-2 text-left">Name</th>
//     //         <th className="px-4 py-2 text-left">Points</th>
//     //       </tr>
//     //     </thead> */}

//     //   {data.map((user, index) => {
//     //     let borderClass = "border-2 border-[#ee3ec9]"; // Default border color for 4th place and beyond

//     //     if (index === 0) {
//     //       borderClass = "border-2 border-[#ffd700]"; // Apply gold border to 1st place
//     //     } else if (index === 1) {
//     //       borderClass = "border-2 border-[#c0c0c0]"; // Apply silver border to 2nd place
//     //     } else if (index === 2) {
//     //       borderClass = "border-2 border-[#cd7f32]"; // Apply bronze border to 3rd place
//     //     }

//     //     return (
//     //       <tr key={index} className={`${borderClass} my-2`}>
//     //         <td className="px-4 py-2 text-center">{index + 1}</td>
//     //         <td className="px-2 py-2 flex items-center">
//     //           <img
//     //             src={userProfilePic}
//     //             alt={user.principal}
//     //             className="h-8 rounded-full mr-2"
//     //           />
//     //           <span className="text-sm">{user.principal}</span>
//     //         </td>
//     //         <td className="px-4 py-2 text-center">{user.points} pts.</td>
//     //       </tr>
//     //     );
//     //   })}
//     // </table>

//     <ul>
//       {data.map((user, index) => {
//         let borderClass = "border-2 border-[#ee3ec9]"; // Default border color for 4th place and beyond

//         if (index === 0) {
//           borderClass = "border-2 border-[#ffd700]"; // Apply gold border to 1st place
//         } else if (index === 1) {
//           borderClass = "border-2 border-[#c0c0c0]"; // Apply silver border to 2nd place
//         } else if (index === 2) {
//           borderClass = "border-2 border-[#cd7f32]"; // Apply bronze border to 3rd place
//         }
//         return (

//           <li
//           key={user.principal}
//           className={`flex items-center justify-between px-4 py-2 my-4 ${borderClass}`}
//         >
//           <div className="flex items-center">
//             <img
//               src={userProfilePic}
//               alt={user.principal}
//               className="h-8 rounded-full mr-2"
//               />
//             <span className="text-sm">{user.principal}</span>
//           </div>
//           <span className="text-sm">{user.points} pts.</span>
//         </li>;
//     )
//       })}
//     </ul>
//   );
// };

const LeaderBoardList = ({ data }) => {
  return (
    <ul>
      {data.map((user, index) => {
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
            key={user.principal}
            className={`flex items-center justify-between px-4 py-2 my-4 ${borderClass}`}
          >
            <div className="flex items-center">
              <img
                src={userProfilePic}
                alt={user.principal}
                className="h-8 rounded-full mr-2"
              />
              <span className="text-sm">{user.principal}</span>
            </div>
            <span className="text-sm">{user.points} pts.</span>
          </li>
        );
      })}
    </ul>
  );
};
export default LeaderBoardList;
