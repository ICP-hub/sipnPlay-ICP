import addTrapsEvents from "./traps.js";
import addMonstersEvents from "./monsters.js";
import addCoinsEvents from "./coins.js";
import addFlasksEvents from "./flasks.js";
import addChestsEvents from "./chests.js";
import addLadderEvents from "./ladder.js";

export const addEvents = () => {
  addTrapsEvents();
  addMonstersEvents();
  addCoinsEvents();
  addFlasksEvents();
  addChestsEvents();
  addLadderEvents();
};