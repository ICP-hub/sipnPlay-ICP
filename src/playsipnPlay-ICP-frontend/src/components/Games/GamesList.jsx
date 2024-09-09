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
      className="max-w-full bg-cover bg-center min-h-screen lg:py-4"
    >
      <div className="flex flex-col md:flex-row gap-8 max-w-screen-xl md:pe-16">
        <GamesNav />
        <div className="flex-1 mt-4 lg:mt-0">
          <div className="flex flex-wrap justify-center md:grid md:grid-cols-2 lg:grid-cols-3 gap-16">
            {games.map((game, i) => (
              <Game key={game.name} game={game} />
            ))}
          </div>
        </div>
      </div>
      <p className="text-center py-8 place-self-end font-adam font-semibold text-2xl">
        More games coming soon...
      </p>
    </div>
  );
};

export default GamesList;
