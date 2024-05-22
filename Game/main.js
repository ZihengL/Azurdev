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

document.addEventListener("DOMContentLoaded", function () {
  Level.setInstance(lang, profile, selectedLevel).then(function (instance) {
    const level = instance;

    // MAIN MENU

    // MAP MENU
    const container = document.getElementById("level_select_btns");
    for (var i = 0; i < LEVELS.length; i++) {
      const levelBtn = document.createElement("button");

      levelBtn.id = "btn_" + i;
      levelBtn.class = "btn-level";
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
    // const btn_quit = document.getElementById("btn_quitLevel");
    // document.getElementById("btn_quitLevel").onclick = function () {
    //   setToScreen(SCREENS.MAP);
    //   Level.STOPPED = true;
    // };

    // document.getElementById("btn_pauseLevel").onclick = function () {
    //   console.log("asdasdas");
    //   Level.PAUSED = !Level.PAUSED;
    // };

    document.addEventListener("keydown", function (event) {
      const value = KEYMAPS[event.key];
      console.log(event.key, value, event.code, currentScreen);

      switch (currentScreen) {
        case SCREENS.GAME:
          if (!Level.STOPPED) {
            switch (value) {
              case "A":
              case "B":
              case "C":
              case "D":
                level.lastKeyPressed = value;
                break;
              case "EXIT":
                Level.quitInstance();
                break;
              default:
                Level.pauseInstance();
                console.log("Pause", Level.PAUSED);
            }
          }
          break;
        case SCREENS.MAP:
          break;
        case SCREENS.MAIN:
          break;
        default:
          console.log("Key '" + event.key + "' not mapped to command.");
      }
    });

    changeLanguage();
    setToScreen(currentScreen);
  });
});
