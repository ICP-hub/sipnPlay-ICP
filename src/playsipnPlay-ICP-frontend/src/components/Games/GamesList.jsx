import React, { useState } from "react";
// import blackjackLogo from "../../assets/images/blackjack.png";
// import tetrisLogo from "../../assets/images/tetris.png";
// import bubbleLogo from "../../assets/images/bubble.png";
import Game from "./Game";
import { games } from "./gameData";
import GamesNav from "./GamesNav";
import { useFetching } from "../../utils/fetchingContext";
import { Oval } from "react-loader-spinner";

const GamesList = () => {
  const { isFetching, setIsFetching } = useFetching();

  return (
    <div
      style={{
        background: "linear-gradient(to right, #ee3ec927, black, #ee3ec927)",
      }}
      className="max-w-full flex-grow h-full flex flex-col justify-between lg:py-12" //DO NOT REMOVE H_FULL
    >
      <div className=" relative flex flex-col md:flex-row gap-8 max-w-screen-xl h-full   ">
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
          <div className="flex-1 mt-4 lg:mt-0 mx-auto justify-between">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
              {games.map((game, i) => (
                <Game key={game.link} game={game} />
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-center font-adam font-semibold text-md md:text-lg lg:text-xl my-4 md:my-0">
        More games coming soon...
      </p>
    </div>
  );
};

export default GamesList;
