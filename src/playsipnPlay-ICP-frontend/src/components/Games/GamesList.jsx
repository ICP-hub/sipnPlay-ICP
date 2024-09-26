import React, { useState } from "react";
import bgImage from "../../assets/images/waitlistBg.png";
import blackjackLogo from "../../assets/images/blackjack.png";
import EboolImg from "../../assets/images/8bool.png";
import bkingImg from "../../assets/images/burgerking.png";
import Game from "./Game";
import GamesNav from "./GamesNav";
import { useFetching } from "../../utils/fetchingContext";
import { Oval } from "react-loader-spinner";

const GamesList = () => {
  const { isFetching, setIsFetching } = useFetching();
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
      className="max-w-full min-h-screen flex flex-col justify-between lg:py-12"
    >
      <div className=" relative flex flex-col md:flex-row gap-8 max-w-screen-xl md:pe-16">
        <GamesNav />

        {isFetching ? (
          <div className="flex-1 h-full w-full justify-center items-center mt-36">
            <Oval
              color="#ee3ec9"
              secondaryColor="#fff"
              height={128}
              width={128}
              wrapperClass="flex justify-center items-center"
            />
          </div>
        ) : (
          <div className="flex-1 mt-4 lg:mt-0 justify-between">
            <div className=" flex flex-wrap justify-center md:grid lg:grid-cols-2 gap-16">
              {games.map((game, i) => (
                <Game key={game.name} game={game} />
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-center font-adam font-semibold text-md md:text-lg lg:text-xl">
        More games coming soon...
      </p>
    </div>
  );
};

export default GamesList;
