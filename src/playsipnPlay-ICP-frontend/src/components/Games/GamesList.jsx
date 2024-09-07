import React, { useState } from "react";
import bgImage from "../../assets/images/waitlistBg.png";
import blackjackLogo from "../../assets/images/blackjack.png";
import EboolImg from "../../assets/images/8bool.png";
import bkingImg from "../../assets/images/burgerking.png";
import Game from "./Game";
import GamesNav from "./GamesNav";

const GamesList = () => {
  const [games, setGames] = useState([
    { name: "BlackJack", img: blackjackLogo },
    { name: "8ballpool", img: EboolImg },
    { name: "burgerking", img: bkingImg },
    ,
  ]);

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="max-w-screen bg-cover bg-center min-h-screen py-8"
    >
      <div className="flex flex-col lg:flex-row gap-8 px-8 max-w-screen-xl">
        <GamesNav className="flex-shrink-0 lg:w-1/4" />
        <div className="flex-1 lg:ml-8 mt-4 lg:mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {games.map((game, index) => (
              <Game key={index} game={game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesList;
