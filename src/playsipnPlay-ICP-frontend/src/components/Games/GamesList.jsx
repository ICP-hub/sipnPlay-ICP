import React, { useState } from "react";
import AnimationButton from "../../common/AnimationButton";
import Game from "./Game";
import { games } from "./gameData";
import { useFetching } from "../../utils/fetchingContext";
import { Oval } from "react-loader-spinner";
import GameDetails from "./GameDetails";


import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';

const GamesList = () => {
  const { isFetching } = useFetching();
  const [gameIndex, setGameIndex] = useState(0);
  const [showPopUp, setShowPopUp] = useState(false);

  const closemodal = () => {
    setShowPopUp(false);
  };

  return (
    <div className={`bg-[${games[gameIndex].bgColor}]`}>
      <div>
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
          <div>
            <div className={`relative -z-10`}>
              <div className={`w-[358px] h-[358px] absolute -left-[132px] top-[128px] rounded-full blur-3xl opacity-45 bg-[${games[gameIndex].designColor}]`}></div>
              <div className={`w-[248px] h-[248px] absolute -right-[12px] top-[268px] rounded-full blur-3xl opacity-45 bg-[${games[gameIndex].designColor}]`}></div>
              <div className={`w-[248px] h-[248px] absolute right-[112px] top-[458px] rounded-full blur-3xl opacity-45 bg-[${games[gameIndex].designColor}]`}></div>
              {/* <div className={`w-[358px] h-[358px] absolute -left-[132px] top-[128px] rounded-full blur-3xl opacity-45 bg-[${games[gameIndex].designColor}]`}></div>
              <div className={`w-[358px] h-[358px] absolute -left-[132px] top-[128px] rounded-full blur-3xl opacity-45 bg-[${games[gameIndex].designColor}]`}></div> */}
            </div>
            <div className="z-10 grid grid-cols-3 mt-6 items-center px-[9%]">
              <div>
                <p className="font-monckeberg text-6xl">{games[gameIndex].name}</p>
                <p className="font-adam mt-5 mb-5 line-clamp-5">{games[gameIndex].description}</p>
                <div className="flex gap-4">
                  <AnimationButton onClick={() => setShowPopUp(true)} >Play</AnimationButton>
                  {showPopUp && (
                    <GameDetails
                      modalIsOpen={showPopUp}
                      closeModal={closemodal}
                      game={games[gameIndex]}
                      tokenomics={games[gameIndex].tokenomics}
                    />
                  )}
                  {games[gameIndex].leaderboard &&
                    <AnimationButton onClick="" >Leaderboard</AnimationButton>
                  }
                </div>
              </div>
              <div>
                <img src={games[gameIndex].img} />
              </div>
              <div>
                <div className="mb-12">
                  <h4 className="font-monckeberg mb-4">HOW TO PLAY:</h4>
                  <p className="font-adam line-clamp-[3] text-white text-sm">{games[gameIndex].controls} </p>
                  <span>...</span>
                </div>
                <div className="mb-12">
                  <p className="font-monckeberg mb-4">ABOUT GAME:</p>
                  <ol className="font-adam line-clamp-6 text-white text-sm">
                    {games[gameIndex].description.map((item, i) => (
                      <li key={i}>
                        <span>{i + 1}&#41;</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                  <p>...</p>

                </div>
                <div className="mb-12">
                  <h4 className="font-monckeberg mb-4">TOKENOMICS:</h4>
                  <p className="font-adam line-clamp-[3] text-white text-sm">{games[gameIndex].tokenomics}</p>
                  <p>...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div >
      <div className="ml-[9%] md:w-[650px]">
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          modules={[Autoplay]}
          className="mySwiper"
        >
          {games.map((game, index) => (
              <SwiperSlide onClick={() => setGameIndex(index)}>
                <Game key={index} game={game} />
              </SwiperSlide>
          )
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default GamesList;
