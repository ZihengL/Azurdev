// ! RESTRICTION:
// ! Do not use ES6 syntax, use only ES5 and older
// ! Do not use jQuery library
// ! Do not use any frameworks
// * If you use any imported library check it by top restrictions

// CHROMIUM V38 broswerling.com - 000webhost.org
// Inspect >
// ZiGameAzur - Autobattler!23

// LOCALSTORAGE, SAVE ENTIRE OBJECT AND OVERWRITE
// RESOLUTION CONFIRMITY: 16:9 HD

// MENU: NEW GAME OVERWRITES SAVE FILE
// CONTINUE: SCREEN HAS MAP OF LEVELS.
// SPRITES: MOVE, IDLE, ATTACK, RECEIVE HIT, DIE
// UPGRADES, GET MONEY FROM LEVEL ()

// Remove continue, just a map
// Draw ground for sprites
// Gameloop as interval, interval time based on config
// Spell effect, middle of screen
// Keyboard arrows = tv remote arrows, Enter = enter
// EXIT: 461, backspace, lg: 1001, 1009, ESC computer

// MAP NUMBER BUTTONS TO MAIN MENU

// TODO: LAYERED BACKGROUNDS

const keymap = KEYMAPS.PC;
const surface = new Surface();

const fps = SCREEN.fps[1];
const tickrate = 1000 / fps;

var lang;
var profile = loadProfile();
var currentScreen = SCREENS.MAIN;
var selectedLevel = profile.level_progress;

Level.load().then(function () {
  const level = Level.setInstance(lang, profile, selectedLevel);

  // MAIN MENU

  // MAP MENU
  const container = document.getElementById("level_selection");
  for (var i = 0; i < LEVELS.length; i++) {
    const levelBtn = document.createElement("button");

    levelBtn.id = i;
    levelBtn.textContent = i + 1;

    levelBtn.onclick = (function (levelIndex) {
      return function () {
        updateLevelSelection(levelIndex);
      };
    })(i);

    container.appendChild(levelBtn);
  }
  updateLevelSelection(profile.level_progress);
  // updateMap();

  document.getElementById("btn_play").onclick = function () {
    setToScreen(SCREENS.GAME);
    level.play(tickrate);
  };

  // LEVEL
  document.addEventListener("keydown", function (event) {
    const value = KEYMAPS[event.key];

    console.log(event.key, value);

    switch (value) {
      case "A":
      case "B":
      case "C":
      case "D":
        if (!Level.STOPPED) {
          level.lastKeyPressed = value;
        }
        break;
      case "PAUSE":
        Level.PAUSE = !Level.PAUSE;
        console.log("Pause", Level.PAUSE);
        break;
      case "EXIT":
        setToPreviousScreen(currentScreen);
        Level.STOPPED = true;
        break;
      default:
        console.log("Key '" + event.key + "' not mapped to command.");
    }
  });

  changeLanguage();
  setToScreen(currentScreen);
});
