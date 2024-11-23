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
  const games = [
    {
      link: "blackjack",
      name: "BlackJack",
      img: blackjackLogo,
      description:
        "Blackjack is a card game where players aim to get a hand value as close to 21 as possible without exceeding it. Face cards are worth 10 points, Aces can be 1 or 11, and players compete against the dealer to have the higher hand.",
      controls: `Number cards are worth their face value, face cards are worth 10, and Aces can be 1 or 11. Players are dealt two cards and can choose to "Hit" (take another card) or "Stand" (keep their hand). If a player's hand exceeds 21, they bust and lose. After players finish their turns, the dealer reveals their cards, and hands are compared; the highest hand without busting wins. A hand of exactly 21 is a "Blackjack" and usually wins automatically unless the dealer also has one.`,
      leaderboard:false
    },
    {
      link: "off-the-line",
      name: "Off the Line",
      img: offTheLineLogo,
      description:
        "Action! Danger! Coins! What more could you want from a game?! Jump off the line and try not to die or throw your keyboard across the room in this twitchy arcade tapper. Can you beat all 20 hand-crafted levels? It's harder than it sounds! Good luck and watch out for those walls!",
      controls: `Prevent the blade from lasers or going "off the line", while collecting all the coins, which is the only way to proceed to the next level. Click, (or tap while playing on a phone or a tablet) to change the direction of the blade in order to collect all the coins. You can also drag the blade to the direction you want it to go!`,
      leaderboard:false
    },
    {
      link: "tetris",
      name: "Tetris",
      img: tetrisLogo,
      description:
        "Tetris is a classic puzzle game where players rotate and arrange falling blocks, called tetrominoes, to form complete horizontal lines. Clearing lines scores points, and as the game progresses, it speeds up, challenging players' spatial awareness and reflexes. Its simple yet addictive gameplay has made it a timeless favorite since 1984.",
      controls:
        "Press the directional keys to move the active tetromino. Rotate the active tetromino by pressing the up arrow key. Speed up the falling tetromino by pressing the down arrow key. Press the escape key to pause the game. For phones or tablets, the directional arrow buttons can be pressed to move the active tetromino, the rotate button can be pressed to rotate the active tetromino, the speed up button can be pressed to speed up the falling tetromino, and the pause button can be pressed to pause the game.",
        leaderboard:true
    },
  ];

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
                <Game key={game.link} game={game} />
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
