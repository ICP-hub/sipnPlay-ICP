import React from "react";
import bubble from "../../assets/images/bubble.png";
import tetris from "../../assets/images/tetris.png";
import blacktap from "../../assets/images/blocktap.png";
import blackjack from "../../assets/images/blackjack.png";
import AnimationButton from "../../common/AnimationButton";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Autoplay } from "swiper/modules";

const GameMania = () => {
  const games = [
    { image: blackjack, name: "Black Jack", Description: "Play now" },
    { image: tetris, name: "Blox", Description: "Play now" },
    { image: bubble, name: "Infinity Bubble", Description: "Play now" },
    { image: blacktap, name: "Black Tap", Description: "Play now" },
  ];

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
          breakpoints={{
            320: {
              slidesPerView: 1, // Mobile view
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2, // Tablet view
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3, // Desktop view
              spaceBetween: 30,
            },
          }}
          modules={[Autoplay]}
          className="mySwiper"
        >
          {games.map((game, index) => (
            <SwiperSlide key={index}>
              <div className="relative group flex flex-col rounded-2xl overflow-hidden">
                <div className="bg-gamemania-gradient z-10 rounded-2xl">
                  <img
                    className="h-[194px] py-[22px] mx-auto"
                    draggable="false"
                    src={game.image}
                    alt={game.name}
                  />
                </div>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex flex-col justify-center items-center rounded-2xl z-20 p-[23px] opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-inter font-[700] text-[20px] text-white">
                    {game.name}
                  </p>
                  <a
                    href="https://play.sipnplay.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AnimationButton className="bg-white text-black border border-gray-300 hover:bg-gray-200 transition-all px-6 py-2 rounded-md font-bold">
                      Play now
                    </AnimationButton>
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default GameMania;