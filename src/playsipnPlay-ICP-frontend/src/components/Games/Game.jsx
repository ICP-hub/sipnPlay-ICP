import React from "react";
import { useNavigate } from "react-router-dom";

const Game = ({ game }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: "linear-gradient(to right, #cd335f, #4999f6)",
      }}
      className="min-h-[240px] min-w-[320px] relative md:max-w-[400px] md:min-w-[400px] flex items-center justify-center p-4 border-[1px] transition-transform duration-300 group hover:scale-105 cursor-pointer"
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
