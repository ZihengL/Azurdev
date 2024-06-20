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

// NO FLOAT FOR MANA
// NO MOVING BACKGROUND DURING BATTLE
// GROUND PICTURE
// BUTTON SIZE ++

// GAP, FLEX NOT COMPATIBLE
// REPLACE FLEX WITH
// REPLACE BUTTON WITH JUST IMG -> PUT ONCLICK DIRECTLY ON IMG

// CREATE SUBFOLDERS FOR SPELLS (NAMED AS SPELLID)
// ICON.PNG, PROJECTILE.PNG
// ALIGN BACKGROUND TO TOP OF GROUND SURFACE

// ARROW NAVIGATION ->
// MAKE LEVELS HARD ENOUGH SO THAT PLAYERS NEED TO PLAY A LEVEL MULTIPLE TIMES FOR ENOUGH MONEY TO GET STUFF FOR NEXT LEVEL
// ON LOSE: NO REWARD AND GET LESS GOLD FROM BEATING SAME LEVEL MULTIPLE TIMES, 1/10 GOLD

const jumptogame = false;

function changeNavSelection(screenId, isIncrement) {}

function inputAction(action, key, screenId) {
  console.log(action, key);

  switch (action) {
    case "1":
    case "2":
    case "3":
    case "4":
      Game.input(action);
      break;
    case "PAUSE":
      Game.pauseInstance();
      break;
    case "EXIT":
      Game.quitInstance();
      break;
    case "PLAY":
      changeScreen(SCREENS.screen_map.id, SCREENS.screen_game.id);
      break;
    case "MAP_TO_MAIN":
      changeScreen(SCREENS.screen_map.id, SCREENS.screen_main.id);
      break;
    case "REDUCE_LEVEL":
      updateLevelSelection(Game.selectedLevel - 1);
      break;
    case "RAISE_LEVEL":
      updateLevelSelection(Game.selectedLevel + 1);
      break;
    case "CONTINUE_GAME":
      changeScreen(SCREENS.screen_main.id, SCREENS.screen_map.id);
      break;
    case "NEW_GAME":
      changeScreen(SCREENS.screen_main.id, SCREENS.screen_map.id, true);
      break;
    case "CHANGE_LANGUAGE":
      changeLanguage();
      break;
    default:
      console.log(
        "Key '" + key + "' not mapped to command on screen id: " + screenId
      );
  }
}

// const keymap = KEYMAPS.PC;
const surface = new Surface();

const fps = SCREEN.fps[1];
const tickrate = 1000 / fps;

var lang = 1;

const screen = new Screen(lang);

Game.setInstance(lang).then(function (instance) {
  var profile = instance.profile;

  // CONTROLS EVENT LISTENER
  document.addEventListener("keydown", function (event) {
    const actives = document.querySelectorAll(".screen.active");
    if (actives.length > 1) return;

    const currentScreen = actives[0];
    const keymap = KEYMAPS[currentScreen.id];
    const key = event.key.toString();

    console.log(key);

    for (const action in keymap) {
      const keyarray = keymap[action];

      if (keyarray.map(String).indexOf(key) !== -1) {
        inputAction(action, key, currentScreen.id);
      }
    }

    const value = KEYMAPS[currentScreen.id][key];

    if (value) {
      if (currentScreen.id === "screen_game") {
      } else {
      }
    }
  });

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

  updateLevelSelection(profile.level_progress);
  changeLanguage();

  if (jumptogame) {
    changeScreen(SCREENS.screen_main, SCREENS.screen_game);
  }
});
