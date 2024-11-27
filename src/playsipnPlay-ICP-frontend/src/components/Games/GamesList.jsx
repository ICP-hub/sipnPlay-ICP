import React, { useState } from "react";
import blackjackLogo from "../../assets/images/blackjack.png";
import tetrisLogo from "../../assets/images/tetris.webp";
import Game from "./Game";
import GamesNav from "./GamesNav";
import { useFetching } from "../../utils/fetchingContext";
import { Oval } from "react-loader-spinner";

const games = [
  {
    link: "blackjack",
    name: "BlackJack",
    img: blackjackLogo,
    description:
      "Blackjack is a card game where players aim to get a hand value as close to 21 as possible without exceeding it. Face cards are worth 10 points, Aces can be 1 or 11, and players compete against the dealer to have the higher hand.",
    controls: `Number cards are worth their face value, face cards are worth 10, and Aces can be 1 or 11. Players are dealt two cards and can choose to "Hit" (take another card) or "Stand" (keep their hand). If a player's hand exceeds 21, they bust and lose. After players finish their turns, the dealer reveals their cards, and hands are compared; the highest hand without busting wins. A hand of exactly 21 is a "Blackjack" and usually wins automatically unless the dealer also has one.`,
    leaderboard: false,
    tokenomics:
      "In the tokenomics of this blackjack game, players place a bet by deducting the specified amount from their balance before starting the game. If the player wins, they receive double the amount of their original bet. In the case of a loss, no further deduction occurs as the bet is already deducted at the start. Additionally, if the player draws a perfect 21 on the first hand (a blackjack), they earn 2.5 times the amount of their initial bet as a special bonus. This structure ensures a seamless and engaging experience while maintaining a clear and transparent token flow.",
  },
  {
    link: "tetris",
    name: "Tetris",
    img: tetrisLogo,
    description:
      "Tetris is a classic puzzle game where players rotate and arrange falling blocks, called tetrominoes, to form complete horizontal lines. Clearing lines scores points, and as the game progresses, it speeds up, challenging players' spatial awareness and reflexes. Its simple yet addictive gameplay has made it a timeless favorite since 1984.",
    controls:
      "Press the directional keys to move the active tetromino. Rotate the active tetromino by pressing the up arrow key. Speed up the falling tetromino by pressing the down arrow key. Press the escape key to pause the game. For phones or tablets, the directional arrow buttons can be pressed to move the active tetromino, the rotate button can be pressed to rotate the active tetromino, the speed up button can be pressed to speed up the falling tetromino, and the pause button can be pressed to pause the game.",
    leaderboard: true,
    tokenomics:
      "Players are required to pay a one-time fee of 30 TSIP tokens everytime they start the game. Once the game is over, the player receives points (which is 10 times their score) based on their in-game performance. Additionally, the player's rank on the leaderboard is determined by the number of points they have, with higher points securing higher rankings. Players earn TSIP tokens as rewards based on their position in the leaderboard, incentivizing skillful gameplay and competition for top spots.",
  },
];
const GamesList = () => {
  const { isFetching, setIsFetching } = useFetching();

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
