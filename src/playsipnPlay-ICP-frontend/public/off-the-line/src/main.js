var screenWidth = window.innerWidth; // Get the viewport width
var screenHeight = window.innerHeight; // Get the viewport height
var screenScale = 1;

var aw = new Aw(screenWidth, screenHeight, screenScale, []);
aw.state = init;

var level;
var player;
var levelIdx = 0;
var endLevelTime = 0;
var lives = 5;
var difficultyMode = 0;

function init(deltaTime) {
  renderBackgroundSpeedLines(deltaTime);

  if (aw.mouseLeftButtonJustPressed) {
    aw.state = mainMenu;
    aw.mouseLeftButtonJustPressed = false;

    aw.playNote("a", 4, 0.05, 0.0);
    aw.playNote("b", 4, 0.05, 0.05);
  }

  // Click to play
  aw.ctx.shadowBlur = 20;
  aw.ctx.shadowColor = "#08F";
  aw.drawText({
    text: "CLICK TO PLAY",
    x: screenWidth * 0.5,
    y: screenHeight * 0.5,
    fontSize: 20,
    fontStyle: "bold",
    color: "#08F",
    textAlign: "center",
  });
}

// Ensure the screen adjusts on window resize (important for responsive layout)
window.addEventListener("resize", function () {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  // Re-initialize or update the game screen size
  aw.resize(screenWidth, screenHeight);
});

// Disable mouse wheel scrolling
window.addEventListener(
  "wheel",
  function (event) {
    event.preventDefault(); // Prevent scrolling
  },
  { passive: false }
);

// Disable touch scroll
window.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault(); // Prevent scrolling on touch devices
  },
  { passive: false }
);

// Disable keyboard scroll (e.g., arrow keys, spacebar)
window.addEventListener("keydown", function (event) {
  // You can add other keys if needed, but this will block most common scroll actions
  if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
    event.preventDefault(); // Prevent scrolling using arrow keys or spacebar
  }
});
