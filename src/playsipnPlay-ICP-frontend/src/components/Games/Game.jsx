// import React from "react";

// const Game = ({ game }) => {
//   return (
//     <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex items-center justify-center p-4 bg-gradient-to-r from-[#cd335f] to-[#4999f6] border-[#EE3EC9] border-[1px] ">
//       <div className="absolute w-full h-full flex items-center bg-none justify-center transition-all duration-300 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm">
//         <div className="absolute h-[5px] w-[5px] -top-[1px] -left-[1px] border-t-[1px] border-l-[1px] border-white "></div>
//         <div className="absolute h-[5px] w-[5px] -top-[1px] -right-[1px] border-t-[1px] border-r-[1px] border-white "></div>
//         <div className="absolute h-[5px] w-[5px] -bottom-[1px] -left-[1px] border-b-[1px] border-l-[1px] border-white "></div>
//         <div className="absolute h-[5px] w-[5px] -bottom-[1px] -right-[1px] border-b-[1px] border-r-[1px] border-white "></div>
//         Play
//       </div>
//       <img
//         src={game.img}
//         alt="game-image"
//         className="w-full h-auto max-w-3/4"
//       />
//     </div>
//   );
// };

// export default Game;

import React from "react";
import { useNavigate } from "react-router-dom";

const Game = ({ game }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: "linear-gradient(to right, #cd335f, #4999f6)",
      }}
      className="relative md:max-w-[400px] w-3/4 md:w-full flex items-center justify-center p-4 border-[1px] transition-transform duration-300 group hover:scale-105 cursor-pointer"
      onClick={() => navigate(`/${game.name}`)}
    >
      <div className="absolute h-[5px] w-[5px] -top-[1px] -left-[1px] border-t-[1px] border-l-[1px] border-white "></div>
      <div className="absolute h-[5px] w-[5px] -top-[1px] -right-[1px] border-t-[1px] border-r-[1px] border-white "></div>
      <div className="absolute h-[5px] w-[5px] -bottom-[1px] -left-[1px] border-b-[1px] border-l-[1px] border-white "></div>
      <div className="absolute h-[5px] w-[5px] -bottom-[1px] -right-[1px] border-b-[1px] border-r-[1px] border-white "></div>
      <div
        style={{ backgroundColor: "#00000070", backdropFilter: "blur(5px)" }}
        className="absolute w-full h-0 flex items-center justify-center transition-all duration-300 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 group-hover:h-full"
      >
        Play Now
      </div>
      <img src={game.img} alt="game-image" className=" object-contain" />
    </div>
  );
};

export default Game;
