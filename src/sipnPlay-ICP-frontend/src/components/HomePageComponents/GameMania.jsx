import React, { useState } from "react";
import bubble from "../../assets/images/bubble.png";
import Bool8 from "../../assets/images/8bool.png";
import tetris from "../../assets/images/tetris.png";
import blacktap from "../../assets/images/blocktap.png";
import blackjack from "../../assets/images/blackjack.png";
import AnimationButton from "../../common/AnimationButton";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";

const GameMania = () => {
  const games = [
    { image: blackjack, name: "Black Jack", Description: "Play now" },
    { image: bubble, name: "Infinity Bubble", Description: "Play now" },
    { image: tetris, name: "Tetris", Description: "Play now" },
    { image: blacktap, name: "Black Tap", Description: "Play now" },
  ];
  const [cards, setCards] = useState(new Array(games.length).fill(false));

  const updateArray = (index) => {
    setCards((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = !newArray[index];
      return newArray;
    });
  };

  return (
    <div className="mx-[9%]">
      <p className="font-inter text-5xl font-[900] text-center">Gamemania</p>
      <div className="mt-8">
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay]}
          className="mySwiper"
        >
          {games.map((game, index) => (
            <SwiperSlide key={index}>
              <div
                onMouseEnter={() => updateArray(index)}
                onMouseLeave={() => updateArray(index)}
                className="flex flex-col"
              >
                <div className="bg-gamemania-gradient z-20 rounded-2xl">
                  <img
                    className="h-[194px] py-[22px] mx-auto"
                    draggable="false"
                    src={game.image}
                  />
                </div>
                {cards[index] && (
                  <div className="rounded-b-2xl z-10 animate-translate-y -mt-4 bg-gradient-to-r p-[23px] from-[#64646459] to-[#5E5E5E2D]">
                    <p className="font-inter font-[700] text-[20px] mt-6">
                      {game.name}
                    </p>
                    {game.Description === "Play now" && (
                      <a href="https://play.sipnplay.io" target="_blank">
                        <AnimationButton>Play now</AnimationButton>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default GameMania;