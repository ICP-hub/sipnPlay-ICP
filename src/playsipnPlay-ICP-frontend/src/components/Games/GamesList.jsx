import React, { useState } from "react";
import blackjackLogo from "../../assets/images/blackjack.png";
import tetrisLogo from "../../assets/images/tetris.png";
import Game from "./Game";
import GamesNav from "./GamesNav";
import { useFetching } from "../../utils/fetchingContext";
import { Oval } from "react-loader-spinner";

const games = [
  {
    link: "blackjack",
    name: "BlackJack",
    img: blackjackLogo,
    description: [
      `The objective of Blackjack is to have a hand value as close to or equal to 21 as possible without exceeding it.`,
      `Card values are as follows: number cards (2-10) are worth their face value, face cards (Jack, Queen, King) are worth 10 points, and Aces can be worth either 1 or 11 points.`,
      `Players are dealt two cards, typically face-up, while the dealer has one card face-up and one card face-down (the "hole card").`,
      `Players can choose to "Hit" (ask for another card), "Stand" (keep their current hand) or "Split" (split two cards of the same rank into two hands).`,
      `The dealer must follow specific rules: they must hit if their hand is 16 or less and stand if it's 17 or more.`,
      `A player wins if their hand value is closer to or equal to 21 than the dealer's hand, without exceeding 21.`,
      `A Blackjack occurs when the player or dealer has an Ace and a 10-point card as their first two cards, and it usually beats a regular 21.`,
      `Regular wins pay 1:1, while Blackjack pays 3:2. If the dealer has a Blackjack, players lose unless they also have one.`,
      `If a player's hand exceeds 21, they "bust" and lose automatically. If the dealer busts, remaining players win.`,
      `If the dealer's upcard is an Ace, players can take an "insurance" bet to protect against the dealer having a Blackjack.`,
      `Basic strategy is a method to determine the best play based on the player's hand and the dealer's upcard.`,
      `Blackjack is often played with multiple decks of cards, making card counting difficult.`,
    ],
    controls: `Number cards are worth their face value, face cards are worth 10, and Aces can be 1 or 11. Players are dealt two cards and can choose to "Hit" (take another card) or "Stand" (keep their hand). If a player's hand exceeds 21, they bust and lose. After players finish their turns, the dealer reveals their cards, and hands are compared; the highest hand without busting wins. A hand of exactly 21 is a "Blackjack" and usually wins automatically unless the dealer also has one.`,
    leaderboard: false,
    tokenomics:
      "In the tokenomics of this blackjack game, players place a bet by deducting the specified amount from their balance before starting the game. If the player wins, they receive double the amount of their original bet. In the case of a loss, no further deduction occurs as the bet is already deducted at the start. Additionally, if the player draws a perfect 21 on the first hand (a blackjack), they earn 2.5 times the amount of their initial bet as a special bonus. This structure ensures a seamless and engaging experience while maintaining a clear and transparent token flow.",
  },
  {
    link: "tetris",
    name: "Tetris",
    img: tetrisLogo,
    description: [
      `The goal of Tetris is to arrange falling shapes (called "tetrominoes") into complete lines without gaps. Completed lines disappear, earning the player points.`,
      `Tetrominoes fall from the top of the screen. Players can move and rotate them to fit them into place as they descend.`,
      `When a row of blocks is filled completely with no gaps, it disappears, and the player earns points. Multiple rows can be cleared at once.`,
      `The game ends when the stack of blocks reaches the top of the screen, leaving no room for new tetrominoes to fall.`,
      `Players earn points for clearing lines. Clearing more lines at once (such as clearing two or four lines simultaneously) results in higher scores.`,
      `Successful players must plan ahead, rotate tetrominoes to fit the gaps, and stack pieces efficiently to prevent the blocks from piling up too high.`,
      `Players can move tetrominoes left, right, or down, and rotate them to fit into the available space.`,
      `The game randomly selects which tetromino will fall next, adding an element of unpredictability and requiring players to adapt quickly.`,
      `Unlike many games, Tetris does not involve combat but focuses on spatial reasoning and quick decision-making.`,
    ],
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
