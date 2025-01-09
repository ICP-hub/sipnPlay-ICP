import blackjackLogo from "../../assets/images/blackjack.png";
import tetrisLogo from "../../assets/images/tetris.png";
import bubbleLogo from "../../assets/images/bubble.png";
import blocktapLogo from "../../assets/images/blocktap.png";

export const games = [
  {
    link: "blackjack",
    name: "BlackJack",
    img: blackjackLogo,
    description: `Blackjack is a popular card game typically played with one or more decks, where the goal is to have a hand value as close to 21 as possible without exceeding it. Players are dealt two cards and can choose to "hit" (draw another card) or "stand" (keep their current hand). Face cards (Kings, Queens, Jacks) are worth 10 points, Aces can be worth either 1 or 11, and numbered cards retain their face value. The dealer also plays by specific rules and must stand on 17 or higher. The player who gets closer to 21, without going over, wins.`,
    controls: `Number cards are worth their face value, face cards are worth 10, and Aces can be 1 or 11. Players are dealt two cards and can choose to "Hit" (take another card) or "Stand" (keep their hand). If a player's hand exceeds 21, they bust and lose. After players finish their turns, the dealer reveals their cards, and hands are compared; the highest hand without busting wins. A hand of exactly 21 is a "Blackjack" and usually wins automatically unless the dealer also has one.`,
    leaderboard: false,
    tokenomics:
      "In the tokenomics of this blackjack game, players place a bet by deducting the specified amount from their balance before starting the game. If the player wins, they receive double the amount of their original bet. In the case of a loss, no further deduction occurs as the bet is already deducted at the start. Additionally, if the player draws a perfect 21 on the first hand (a blackjack), they earn 2.5 times the amount of their initial bet as a special bonus. This structure ensures a seamless and engaging experience while maintaining a clear and transparent token flow.",
    bgColor: "#000000",
    designColor: "#94AF26",
  },
  {
    link: "tetris",
    name: "Tetris",
    img: tetrisLogo,
    description: `Tetris is a classic puzzle video game where players must fit falling blocks, called Tetrominoes, into a grid. The goal is to complete horizontal lines without gaps, which causes the lines to disappear, earning points. As the game progresses, the blocks fall faster, increasing the challenge. Players must think quickly and strategically to prevent the screen from filling up, as the game ends when the blocks stack too high. Known for its simple yet addictive gameplay, Tetris has become one of the most iconic and enduring video games in history.`,
    controls:
      "Press the directional keys to move the active tetromino. Rotate the active tetromino by pressing the up arrow key. Speed up the falling tetromino by pressing the down arrow key. Press the escape key to pause the game. For phones or tablets, the directional arrow buttons can be pressed to move the active tetromino, the rotate button can be pressed to rotate the active tetromino, the speed up button can be pressed to speed up the falling tetromino, and the pause button can be pressed to pause the game.",
    leaderboard: true,
    tokenomics:
      "Players are required to pay a one-time fee of 30 TSIP tokens everytime they start the game. Once the game is over, the player receives points (which is 10 times their score) based on their in-game performance. Additionally, the player's rank on the leaderboard is determined by the number of points they have, with higher points securing higher rankings. Players earn TSIP tokens as rewards based on their position in the leaderboard, incentivizing skillful gameplay and competition for top spots.",
    bgColor: "#00075F",
    designColor: "#CD4650",
  },
  {
    link: "infinity-bubble",
    name: "Infinity Bubble",
    img: bubbleLogo,
    // description: [
    //   `Infinity Bubble is an exciting puzzle game where you control a shooter that fires bubbles at a grid of random-colored bubbles at the top of the screen.`,
    //   `Your goal is to match three or more bubbles of the same color to make them pop and score points.`,
    //   `The shooter constantly holds a random-colored bubble, and you must aim and shoot strategically to create combos.`,
    //   `The more bubbles you pop in a single shot, the higher your score.`,
    //   `Challenge yourself to clear the screen and achieve the highest possible points in this fast-paced, addictive game!`,
    //   `The game is over once the bubbles reach the bottom of the screen, so act quickly and aim accurately to keep the game going.`,
    // ],
    description: `Infinity Bubble is an exciting puzzle game where you control a shooter that fires bubbles at a grid of random-colored bubbles at the top of the screen. Your goal is to match three or more bubbles of the same color to make them pop and score points. The more bubbles you pop in a single shot, the higher your score. Challenge yourself to clear the screen and achieve the highest possible points in this fast-paced, addictive game! The game is over once the bubbles reach the bottom of the screen, so act quickly and aim accurately to keep the game going.`,
    controls: `Aim and shoot colored bubbles to match three or more of the same color and score points. On PC, use the mouse to aim and left-click to shoot. On mobile devices, simply tap to shoot and hold to aim. Use the ricochet feature by bouncing bubbles off the screen corners to reach difficult spots. Strategically clear bubbles to achieve high scores and combos!`,
    leaderboard: true,
    tokenomics:
      "Players are required to pay a one-time fee of 30 TSIP tokens everytime they start the game. Once the game is over, the player receives points (which is 10 times their score) based on their in-game performance. Additionally, the player's rank on the leaderboard is determined by the number of points they have, with higher points securing higher rankings. Players earn TSIP tokens as rewards based on their position in the leaderboard, incentivizing skillful gameplay and competition for top spots.",
    bgColor: "#035A16",
    designColor: "#F1F967",
  },
  {
    link: "block-tap",
    name: "Block Tap",
    img: blocktapLogo,
    description: `Block Tap is an exciting mix of arcade and puzzle, consisting of many blocks, each having a number along with it.,
      Players begin with a limited number of moves. Each attempt, whether successful or not, consumes one move.,
      To regain moves, players must create combos by selecting 3 blocks whose values, when added or subtracted, match a target sum.,
      Success depends on careful planning and choosing the right blocks to form combos while conserving moves.,
      Points are awarded for every successful combo, with higher scores for more combos.,
      The game ends when moves are exhausted or no valid combos can be made.`,
    controls: `Click or tap on a block to increase the number on it. You can also reduce the number if you have enough coins, which you earn while you play the game and making as many combos as possible. Higher combos lead to higher number of coins.`,
    leaderboard: true,
    tokenomics:
      "Players are required to pay a one-time fee of 30 TSIP tokens everytime they start the game. Once the game is over, the player receives points (which is 10 times their score) based on their in-game performance. Additionally, the player's rank on the leaderboard is determined by the number of points they have, with higher points securing higher rankings. Players earn TSIP tokens as rewards based on their position in the leaderboard, incentivizing skillful gameplay and competition for top spots.",
    bgColor: "#011100",
    designColor: "#6FFFCA",
  },
];

//
