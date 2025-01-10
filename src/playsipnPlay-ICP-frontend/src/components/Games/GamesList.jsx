import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import LeaderBoardList from "./LeaderboardList";

const GamesList = () => {
  const { isFetching } = useFetching();
  const [currentGame, setCurrentGame] = useState(games[0]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [showFullControls, setshowFullControls] = useState(false);
  const [showFullTokenomics, setshowFullTokenomics] = useState(false);
  const [showFullDescription, setshowFullDescription] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const navigate = useNavigate();

  const closemodal = () => {
    setShowPopUp(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const descriptionVariants = {
    hidden: { 
      opacity: 0, 
      x: -100,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  const additionalContentVariants = {
    hidden: { 
      opacity: 0, 
      x: 100,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
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
          <motion.div
            className="py-16 md:py-4 text-center md:text-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8">
              {/* Image */}
              <motion.div
                className="order-1 md:order-2 flex items-center"
                variants={imageVariants}
                key={currentGame.img}
                initial="hidden"
                animate="visible"
              >
                <img draggable="false" src={currentGame.img} />
              </motion.div>

              {/* Description */}
              <motion.div 
                className="order-2 md:order-1"
                variants={descriptionVariants}
                initial="hidden"
                animate="visible"
                key={`desc-${currentGame.name}`}
              >
                <motion.h1
                  className="font-monckeberg text-4xl md:text-6xl"
                >
                  {currentGame.name}
                </motion.h1>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={showFullDescription ? 'full' : 'partial'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-adam text-white text-sm mt-8"
                  >
                    {showFullDescription
                      ? currentGame.controls + "..."
                      : currentGame.controls.slice(0, 400)}
                  </motion.p>
                </AnimatePresence>

                <motion.span
                  onClick={() => setshowFullDescription(!showFullDescription)}
                  className="font-adam text-sm cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showFullDescription ? "show less" : "show more"}
                </motion.span>

                <motion.div
                  className="flex gap-4 mt-8 w-full md:justify-start justify-center items-center"
                >
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
                  
                  {currentGame.leaderboard && (
                    <AnimationButton onClick={() => setShowLeaderboard(true)}>
                      Leaderboard
                    </AnimationButton>
                  )}
                </motion.div>

                {showLeaderboard && (
                  <LeaderBoardList
                    showLeaderboard={showLeaderboard}
                    setShowLeaderboard={setShowLeaderboard}
                    game={currentGame}
                    isGameOver={false}
                  />
                )}
              </motion.div>

              {/* Additional Content */}
              <motion.div 
                className="order-3"
                variants={additionalContentVariants}
                initial="hidden"
                animate="visible"
                key={`additional-${currentGame.name}`}
              >
                <motion.div className="mb-12">
                  <motion.h4 className="font-monckeberg mb-4">
                    HOW TO PLAY:
                  </motion.h4>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={showFullControls ? 'full' : 'partial'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-adam text-white text-sm"
                    >
                      {showFullControls
                        ? currentGame.controls + "..."
                        : currentGame.controls.slice(0, 200)}
                    </motion.p>
                  </AnimatePresence>
                  <motion.span
                    onClick={() => setshowFullControls(!showFullControls)}
                    className="font-adam text-sm cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showFullControls ? "show less" : "show more"}
                  </motion.span>
                </motion.div>

                <motion.div className="mb-12">
                  <motion.h4 className="font-monckeberg mb-4">
                    TOKENOMICS:
                  </motion.h4>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={showFullTokenomics ? 'full' : 'partial'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-adam text-white text-sm"
                    >
                      {showFullTokenomics
                        ? currentGame.tokenomics + "..."
                        : currentGame.tokenomics.slice(0, 200)}
                    </motion.p>
                  </AnimatePresence>
                  <motion.span
                    onClick={() => setshowFullTokenomics(!showFullTokenomics)}
                    className="font-adam text-sm cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showFullTokenomics ? "show less" : "show more"}
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>

            {/* Game list */}
            <motion.div
              className="flex gap-4 mt-8 px-4 md:px-8"
              variants={containerVariants}
            >
              {games.map((game, index) => (
                <motion.div
                  key={game.link}
                  onClick={() => setCurrentGame(game)}
                  variants={imageVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Game game={game} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default GamesList;