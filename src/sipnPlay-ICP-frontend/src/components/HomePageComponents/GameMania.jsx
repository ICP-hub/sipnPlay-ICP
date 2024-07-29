import React, { useState } from 'react'
import TicTacToe from "../../assets/images/tictactoe.png";
import Bool8 from "../../assets/images/8bool.png";
import blackjack from "../../assets/images/blackjack.png";
import AnimationButton from '../../common/AnimationButton';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';


import { Autoplay, Pagination } from 'swiper/modules';
const GameMania = () => {
    const games = [{ image: blackjack, name: "Black Jack", Description: "Coming soon" },
    { image: Bool8, name: "8 Ball Pool", Description: "Coming soon" },
    { image: TicTacToe, name: "Tic Tac Toe", Description: "Coming soon" }
    ]
    const [cards, setCards] = useState(new Array(games.length).fill(false));

    const updateArray = (index) => {
        setCards(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = !newArray[index];
            return newArray;
        });
    };
    return (
        <div className='mx-[9%]'>
            <p className='font-inter text-5xl  font-[900] text-center '>Gamemania</p>
            <div className='md:grid grid-cols-3 hidden mt-8 gap-6'>
                {games.map((game, index) => (
                    <div onMouseEnter={() => updateArray(index)} onMouseLeave={() => updateArray(index)} className='flex flex-col' key={index}>
                        <div className='bg-gamemania-gradient z-20 rounded-2xl'>
                            <img className='h-[194px] py-[22px] mx-auto ' draggable="false" src={game.image} />
                        </div>
                        {cards[index] && <div className='rou rounded-b-2xl z-10 animate-translate-y -mt-4 bg-gradient-to-r p-[23px] from-[#64646459] to-[#5E5E5E2D] '>
                            <p className='font-inter font-[700] text-[20px] mt-6  '>{game.name} </p>
                            <p className='text-[14px] font-adam font-[300] my-2  '>{game.Description} </p>
                            <AnimationButton text="Coming Soon" />
                        </div>}
                    </div>
                ))}

            </div>
            <style>{`
                .swiper-pagination-bullet {
                    background-color: white; 
                }

                .swiper-pagination-bullet-active {
                    background-color: #CD335F; 
                }
            `}</style>
            <div className='md:hidden mt-8'>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    pagination={{
                        clickable: true,
                    }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: true,
                      }}
                    modules={[Autoplay, Pagination]}
                    className="mySwiper"
                >
                    {games.map((game, index) => (
                        <SwiperSlide key={index}>
                            <div onMouseEnter={() => updateArray(index)} onMouseLeave={() => updateArray(index)} className='flex flex-col' >
                                <div className='bg-gamemania-gradient z-20 rounded-2xl'>
                                    <img className='h-[194px] py-[22px] mx-auto ' draggable="false" src={game.image} />
                                </div>
                                {cards[index] && <div className='rou rounded-b-2xl z-10 animate-translate-y -mt-4 bg-gradient-to-r p-[23px] from-[#64646459] to-[#5E5E5E2D] '>
                                    <p className='font-inter font-[700] text-[20px] mt-6  '>{game.name} </p>
                                    <p className='text-[14px] font-adam font-[300] my-2  '>{game.Description} </p>
                                    <AnimationButton text="Coming Soon" />
                                </div>}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default GameMania