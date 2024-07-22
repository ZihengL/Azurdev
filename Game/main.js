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

// 086417

var lang = 1;
const fps = SCREEN.fps[1];
const tickrate = 1000 / fps;

local_storage_lib.branch(LOCALSTORAGE.key, LOCALSTORAGE.defaults);

Game.load().then(function () {
  const screen = new Screen(lang, fps);

  // ARROW NAVIGATION
  document.addEventListener("keydown", function (event) {
    screen.registerKey(event.key.toString());
  });

  const p_skill_btns = document.getElementById("p_skill_container").children;
  for (var i = 0; i < p_skill_btns.length; i++) {
    (function (index) {
      p_skill_btns[index].onclick = function () {
        console.log("CLICKED", index);
        screen.registerKey((index + 1).toString());
      };
    })(i);
  }

  const jumptogame = false;
  if (jumptogame) {
    screen.loadProfile();
    screen.playLevel(fps);
  }
});

// MAIN SCREEN BUTTONS

// document.getElementById("btn_newgame").onclick = function () {
//   screen.newgame();
// };

// document.getElementById("btn_quitLevel").onclick = function () {
//   screen.setScreen("screen_map");
// };

// document.getElementById("btn_lang").onclick = function () {
//   screen.changeLanguage();
// };

// MAP BUTTONNS
// document.getElementById("btn_decrement_level").onclick = function () {
//   screen.decrementLevel();
// };

// document.getElementById("btn_increment_level").onclick = function () {
//   screen.incrementLevel();
// };

// document.getElementById("btn_play").onclick = function () {
//   screen.setScreen("screen_game");
//   screen.playLevel(lang, fps);
// };

// document.getElementById("btn_back").onclick = function () {
//   screen.previousScreen();
// };

// MAP MENU
// const container = document.getElementById("level_select_container");
// for (var i = 0; i < LEVELS.length; i++) {
//   const levelBtn = document.createElement("button");

//   levelBtn.id = "btn_level" + i;
//   levelBtn.classList.add("btn-level");
//   levelBtn.textContent = i + 1;

//   levelBtn.onclick = (function (levelIndex) {
//     return function () {
//       screen.selectedLevel = levelIndex;
//     };
//   })(i);

//   container.appendChild(levelBtn);
// }
// screen.updateLevelButtons();
