import React, { useState } from "react";
import blackjackLogo from "../../assets/images/blackjack.png";
import offTheLineLogo from "../../assets/images/offTheLine.webp";
import tetrisLogo from "../../assets/images/tetris.webp";
import Game from "./Game";
import GamesNav from "./GamesNav";
import { useFetching } from "../../utils/fetchingContext";
import { Oval } from "react-loader-spinner";

const GamesList = () => {
  const { isFetching, setIsFetching } = useFetching();
  const [games, setGames] = useState([
    { name: "blackjack", img: blackjackLogo },
    { name: "off-the-line", img: offTheLineLogo },
    { name: "tetris", img: tetrisLogo },
  ]);

  return (
    <div
      style={{
        background: "linear-gradient(to right, #ee3ec927, black, #ee3ec927)",
      }}
      className="max-w-full min-h-screen flex flex-col justify-between lg:py-12"
    >
      <div className=" relative flex flex-col md:flex-row gap-8 max-w-screen-xl   ">
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
            <div className=" flex flex-wrap justify-center md:grid md:grid-cols-2 lg:grid-cols-3 gap-16">
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
