import React, { useState } from "react";
import AnimationButton from "../../common/AnimationButton";
import Game from "./Game";
import { games } from "./gameData";
import { useFetching } from "../../utils/fetchingContext";
import { Oval } from "react-loader-spinner";
import GameDetails from "./GameDetails";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const GamesList = () => {
  const { isFetching } = useFetching();
  const [currentGame, setCurrentGame] = useState(games[0]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [showFullControls, setshowFullControls] = useState(false);
  const [showFullTokenomics, setshowFullTokenomics] = useState(false);
  const navigate = useNavigate();

  const closemodal = () => {
    setShowPopUp(false);
  };

  return (
    <>
      <div className="h-full flex justify-center items-center">
        {isFetching ? (
          <Oval
            color="#ee3ec9"
            secondaryColor="#fff"
            height={128}
            width={128}
            wrapperClass="flex justify-center items-center"
          />
        ) : (
          <div className="py-16 md:py-4 text-center md:text-start">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8">
              {/* Image */}
              <div className="order-1 md:order-2">
                <img draggable="false" src={currentGame.img} />
              </div>
              {/* Description */}
              <div className="order-2 md:order-1">
                <h1 className="font-monckeberg text-2xl md:text-6xl">
                  {currentGame.name}
                </h1>
                <p className="font-adam mt-5 mb-5">{currentGame.description}</p>
                <div className="flex gap-4">
                  <AnimationButton onClick={() => navigate(currentGame.link)}>
                    Play Now
                  </AnimationButton>
                  {showPopUp && (
                    <GameDetails
                      modalIsOpen={showPopUp}
                      closeModal={closemodal}
                      game={currentGame}
                      tokenomics={currentGame.tokenomics}
                    />
                  )}
                  {/* {currentGame.leaderboard && (
                    <AnimationButton onClick="">Leaderboard</AnimationButton>
                  )} */}
                </div>
              </div>

              {/* Additional Content */}
              <div className="order-3">
                <div className="mb-12">
                  <h4 className="font-monckeberg mb-4">HOW TO PLAY:</h4>
                  <p className="font-adam text-white text-sm">
                    {showFullControls
                      ? currentGame.controls + "..."
                      : currentGame.controls.slice(0, 200)}
                  </p>
                  <span
                    onClick={() => setshowFullControls(!showFullControls)}
                    className="font-adam text-sm cursor-pointer"
                  >
                    {showFullControls ? "show less" : "show more"}
                  </span>
                </div>

                <div className="mb-12">
                  <h4 className="font-monckeberg mb-4">TOKENOMICS:</h4>
                  <p className="font-adam text-white text-sm">
                    {showFullTokenomics
                      ? currentGame.tokenomics + "..."
                      : currentGame.tokenomics.slice(0, 200)}
                  </p>
                  <span
                    onClick={() => setshowFullTokenomics(!showFullTokenomics)}
                    className="font-adam text-sm cursor-pointer"
                  >
                    {showFullTokenomics ? "show less" : "show more"}
                  </span>
                </div>
              </div>
            </div>

            {/* Game list */}
            <div className="flex gap-4 mt-8 px-4 md:px-8">
              {games.map((game, index) => (
                <div key={game.link} onClick={() => setCurrentGame(game)}>
                  <Game game={game} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GamesList;
