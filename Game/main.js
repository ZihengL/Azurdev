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

// const keymap = KEYMAPS.PC;
const surface = new Surface();

const fps = SCREEN.fps[1];
const tickrate = 1000 / fps;

var lang = LANGS[0];

Level.setInstance(lang).then(function (instance) {
  const level = instance;
  var profile = instance.profile;

  // MAIN MENU

  // MAP MENU
  const container = document.getElementById("level_select_container");
  for (var i = 0; i < LEVELS.length; i++) {
    const levelBtn = document.createElement("button");

    levelBtn.id = "btn_level" + i;
    levelBtn.classList.add("btn-level");
    levelBtn.textContent = i + 1;

    levelBtn.onclick = (function (levelIndex) {
      return function () {
        updateLevelSelection(levelIndex);
      };
    })(i);

    container.appendChild(levelBtn);
  }

  document.addEventListener("keydown", function (event) {
    const currentScreens = document.querySelectorAll(".screen.active");

    if (currentScreens.length > 1) {
      return;
    }

    const currentScreen = currentScreens[0];
    const value = KEYMAPS[event.key];

    switch (currentScreen.id) {
      case SCREENS.GAME:
        if (!Level.STOPPED && !Level.isLevelEnded()) {
          switch (value) {
            case "A":
            case "B":
            case "C":
            case "D":
              level.input(value);
              break;
            case "EXIT":
              Level.quitInstance();
              break;
            case "PAUSE":
              Level.pauseInstance();
            default:
              console.log(
                "Key '" + event.key + "' not mapped to in-game command."
              );
          }
        }
        break;
      case SCREENS.MAP:
        break;
      case SCREENS.MAIN:
        break;
      default:
        console.log("Key '" + event.key + "' not mapped to any command.");
    }
  });

  updateLevelSelection(profile.level_progress);
  changeLanguage();
});
