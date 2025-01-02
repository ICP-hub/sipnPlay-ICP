import blackjackLogo from "../../assets/images/blackjack.png";
import tetrisLogo from "../../assets/images/tetris.png";
import bubbleLogo from "../../assets/images/bubble.png";
import blocktapLogo from "../../assets/images/blocktap.png";

export const games = [
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
  {
    link: "infinity-bubble",
    name: "Infinity Bubble",
    img: bubbleLogo,
    description: [
      `Infinity Bubble is an exciting puzzle game where you control a shooter that fires bubbles at a grid of random-colored bubbles at the top of the screen.`,
      `Your goal is to match three or more bubbles of the same color to make them pop and score points.`,
      `The shooter constantly holds a random-colored bubble, and you must aim and shoot strategically to create combos.`,
      `The more bubbles you pop in a single shot, the higher your score.`,
      `Challenge yourself to clear the screen and achieve the highest possible points in this fast-paced, addictive game!`,
      `The game is over once the bubbles reach the bottom of the screen, so act quickly and aim accurately to keep the game going.`,
    ],
    controls: `Aim and shoot colored bubbles to match three or more of the same color and score points. On PC, use the mouse to aim and left-click to shoot. On mobile devices, simply tap to shoot and hold to aim. Use the ricochet feature by bouncing bubbles off the screen corners to reach difficult spots. Strategically clear bubbles to achieve high scores and combos!`,
    leaderboard: true,
    tokenomics:
      "Players are required to pay a one-time fee of 30 TSIP tokens everytime they start the game. Once the game is over, the player receives points (which is 10 times their score) based on their in-game performance. Additionally, the player's rank on the leaderboard is determined by the number of points they have, with higher points securing higher rankings. Players earn TSIP tokens as rewards based on their position in the leaderboard, incentivizing skillful gameplay and competition for top spots.",
  },
  {
    link: "block-tap",
    name: "Block Tap",
    img: blocktapLogo,
    description: [
      `Block Tap is an exciting mix of arcade and puzzle, consisting of many blocks, each having a number along with it.`,
      `Players begin with a limited number of moves. Each attempt, whether successful or not, consumes one move.`,
      `To regain moves, players must create combos by selecting 3 blocks whose values, when added or subtracted, match a target sum.`,
      `Success depends on careful planning and choosing the right blocks to form combos while conserving moves.`,
      `Points are awarded for every successful combo, with higher scores for more combos.`,
      `The game ends when moves are exhausted or no valid combos can be made.`,
    ],
    controls: `Click or tap on a block to increase the number on it. You can also reduce the number if you have enough coins, which you earn while you play the game and making as many combos as possible. Higher combos lead to higher number of coins.`,
    leaderboard: true,
    tokenomics:
      "Players are required to pay a one-time fee of 30 TSIP tokens everytime they start the game. Once the game is over, the player receives points (which is 10 times their score) based on their in-game performance. Additionally, the player's rank on the leaderboard is determined by the number of points they have, with higher points securing higher rankings. Players earn TSIP tokens as rewards based on their position in the leaderboard, incentivizing skillful gameplay and competition for top spots.",
  },
];

//
