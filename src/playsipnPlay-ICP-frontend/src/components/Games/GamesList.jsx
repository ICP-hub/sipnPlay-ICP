import React, { useState } from "react";
import bgImage from "../../assets/images/waitlistBg.png";
import blackjackLogo from "../../assets/images/blackjack.png";
import EboolImg from "../../assets/images/8bool.png";
import bkingImg from "../../assets/images/burgerking.png";
import Game from "./Game";
import GamesNav from "./GamesNav";

const GamesList = () => {
  const [games, setGames] = useState([
    { name: "blackjack", img: blackjackLogo },
    // { name: "8ballpool", img: EboolImg },
    // { name: "burgerking", img: bkingImg },
    ,
  ]);

  return (
    <div
      style={{
        background: "linear-gradient(to right, #ee3ec927, black, #ee3ec927)",
      }}
      className="max-w-full min-h-screen bg-cover bg-center lg:py-12"
    >
      <div className="flex flex-col md:flex-row gap-8 max-w-screen-xl md:pe-16">
        <GamesNav />
        <div className="flex-1 mt-4 lg:mt-0">
          <div className="flex flex-wrap justify-center md:grid lg:grid-cols-2 gap-16">
            {games.map((game, i) => (
              <Game key={game.name} game={game} />
            ))}
          </div>
        </div>
      </div>
      <p className="text-center place-self-end font-adam font-semibold text-sm md:text-lg lg:text-xl">
        More games coming soon...
      </p>
    </div>
  );
};

export default GamesList;
