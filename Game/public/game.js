const LOCALSTORAGE = {
  key: "Autobattler",
  defaults: {
    stats: {
      health: PLAYER.stats.health,
      mana: PLAYER.stats.mana,
      mana_regen: PLAYER.stats.mana_regen,
    },
    gold: 100,
    level_progress: 0,
    skills: ["fire_weak", "ice_weak"],
    loadout: ["fire_weak", "ice_weak"],
  },
};

function Game(keymap) {
  this.keymap = keymap || KEYMAPS.PC;
  this.loadProfile();

  this.menu = new MainMenu(this);
  this.map = new MapMenu(this);
  this.level = new Level(Game.res, this.save, this.keymap, this);

  this.switchToMainMenu();
}
Game.res = {};

Game.load = function () {
  return Background.load().then(function (layers) {
    Game.res.background = layers;

    return Player.load().then(function (playerRes) {
      Game.res.player = playerRes;

      return Opponent.load().then(function (opponentRes) {
        Game.res.opponent = opponentRes;
      });
    });
  });
};

// LOCAL STORAGE

Game.prototype.newProfile = function () {
  this.save = local_storage_lib.branch(LOCALSTORAGE.key, LOCALSTORAGE.defaults);
  console.log("New profile", this.save);
};

Game.prototype.saveProfile = function () {
  local_storage_lib.branch(LOCALSTORAGE.key, this.save);

  console.log("Saving profile", this.save);
};

Game.prototype.loadProfile = function () {
  const saved = local_storage_lib.branch(LOCALSTORAGE.key);
  this.save = JSON.stringify(saved) === "{}" ? LOCALSTORAGE.defaults : saved;

  console.log("Loading profile", this.save);
};

// SCREENS

Game.prototype.changeScreen = function (screen) {
  if (this.currentScreen && this.currentScreen.exit) {
    this.currentScreen.exit();
  }
  this.currentScreen = screen;
  if (this.currentScreen && this.currentScreen.init) {
    this.currentScreen.init();
  }
};

Game.prototype.switchToMainMenu = function () {
  setToScreen(MainMenu.div);
};

Game.prototype.switchToMapMenu = function () {
  this.map.init();
  setToScreen(MapMenu.div);
};

Game.prototype.switchToGame = function (levelIdx) {
  setToScreen(Level.div);
  this.level.setLevel(levelIdx);
  this.level.gameloop(performance.now());
};
