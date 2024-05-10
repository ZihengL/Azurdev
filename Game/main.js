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

function setToScreen(screenId) {
  const screens = [MainMenu.div, MapMenu.div, Level.div];

  screens.forEach(function (id) {
    const screen = document.getElementById(id);

    if (screen) {
      if (screenId === id) {
        screen.style.visibility = "visible";
      } else {
        screen.style.visibility = "hidden";
      }
    }
  });
}

// document.addEventListener("DOMContentLoaded", function () {
//   showScreen("main_menu");
// });

const keymap = KEYMAPS.PC;

var currentLevel = LEVELS[0];
var playerConfig = {};

Game.load().then(function () {
  const game = new Game(keymap);

  game.loadProfile();

  document
    .getElementById("btn_quitgame")
    .addEventListener("click", function () {
      Level.STOPPED = true;
      game.switchToMapMenu();
    });

  document.getElementById("btn_newgame").addEventListener("click", function () {
    game.newProfile();
    game.switchToMapMenu();
  });

  document.getElementById("btn_map").addEventListener("click", function () {
    game.switchToMapMenu();
  });

  document
    .getElementById("btn_continue")
    .addEventListener("click", function () {
      game.switchToGame(game.save.level_progress);
    });

  // game.level.gameloop(performance.now());
});
