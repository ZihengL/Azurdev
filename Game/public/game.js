// BACKGROUNDS: RANDOMLY GENERATED LAYERS
// SPECIAL LEVELS ARE STATICALLY DEFINED, OTHERWISE GENERATED

// GET POINTS FOR KILLING AN ENEMY, SPEND IT ON ELEMENTS/POWERS
// BOOK OF SPELLS
// PLAYER STILL NEEDS TO COUNTER ENEMY TYPE ELEMENT

// TODO: SKILL UPDATE/RENDER, PLAYER INTEGRATION, MOB SPAWNING, LEVEL COMPLETION

function Game(screen, lang) {
  this.screen = screen;
  this.lang = lang || LANGS[0];

  this.background = new Background(Game.res.background);
  this.lastUpdate = null;
  this.lastKeyPressed = null;
  this.PAUSED = this.STOPPED = true;

  Game.instance = this;
}
Game.instance = null;
Game.res = {};

// Game.STOPPED = false;
// Game.PAUSED = false;

// -------------- STATIC

Game.load = function () {
  return Background.load().then(function (res) {
    Game.res.background = res;

    return Player.load().then(function (res) {
      Game.res.player = res;

      return Opponent.load().then(function (res) {
        Game.res.opponent = res;
      });
    });
  });
};

Game.setPause = function (paused) {
  Game.PAUSED = paused !== undefined ? paused : !Game.PAUSED;
  setVisibility(document.getElementById("screen_game_btns"), Game.PAUSED);
};

Game.setStop = function (stopped) {
  Game.STOPPED = stopped !== undefined ? stopped : !Game.STOPPED;
};

// -------------- SETUP

Game.prototype.setPlayerProfile = function (profile) {
  this.profile = profile;
};

Game.prototype.setLevel = function (level) {
  console.log("level", level, LEVELS[level]);
  this.level = level || 0;
  this.options = LEVELS[this.level];
  this.killcount = 0;

  this.player = new Player(this.screen.profile, null);
  this.opponent = this.generateMob();

  this.lastKeyPressed = null;
  this.endDelay = null;

  this.background.setScene(this.options.scene);
};

Game.prototype.play = function (tickrate) {
  this.setStop(false);
  this.setPause(false);

  this.lastKeyPressed = null;
  this.lastUpdate = Date.now();
  setGameStatusVisibility();

  this.gameloop(tickrate);
};

Game.prototype.gameloop = function (tickrate) {
  var gameID = setInterval(
    function () {
      var now = Date.now();
      var deltaTime = (now - this.lastUpdate) / 1000;
      this.lastUpdate = now;

      if (!this.STOPPED) {
        // ON WIN OR LOSE
        if ((this.isWon() || this.isLost()) && this.updateLevelEnd(deltaTime)) {
          this.STOPPED = true;
        }

        if (!this.PAUSED) {
          this.update(deltaTime);
        }

        this.render();
      } else {
        this.saveProgress();
        this.screen.setScreen("screen_map");
        clearInterval(gameID);
      }
    }.bind(this),
    tickrate
  );
};

// -------------- UPDATE

// Game.prototype.input = function (key) {

// };

Game.prototype.update = function (deltaTime) {
  this.player.update(deltaTime, this.lastKeyPressed);
  this.opponent.update(deltaTime);
  this.background.update(this.player.getState());

  if (this.opponent.isAtEndPos()) {
    this.killcount++;
    this.opponent = !this.isWon() ? this.generateMob() : null;
  }

  this.lastKeyPressed = null;
};

Game.prototype.updateLevelEnd = function (deltaTime) {
  if (!this.endDelay) {
    var gameStatus = "status_defeat";

    if (this.isWon()) {
      gameStatus = "status_victory";
      this.player.setTargetPosition(this.player.positions.end);
    }

    setGameStatusVisibility(gameStatus);
    this.endDelay = DISPLAY.other.delays.end_delay;
    // return false;
  }

  this.endDelay -= deltaTime;
  return this.endDelay <= 0;
};

// -------------- RENDER

Game.prototype.render = function () {
  Surface.instance.clear();
  this.background.render();
  this.opponent.render();
  this.player.render();
};

// -------------- GETTERS / SETTERS

Game.prototype.setPause = function (paused) {
  this.PAUSED = paused !== undefined ? paused : !this.PAUSED;
  setVisibility(document.getElementById("screen_game_btns"), this.PAUSED);
};

Game.prototype.setStop = function (stopped) {
  this.STOPPED = stopped !== undefined ? stopped : !this.STOPPED;
};

Game.prototype.setStatus = function (elemId) {
  DISPLAY.other.game_status.forEach(function (id) {
    const element = document.getElementById(id);

    setVisibility(element, element.id === elemId);
  });
};

Game.prototype.generateMob = function () {
  const id = getRandomValue(this.options.mob_types);
  const config = OPPONENTS[id];

  const image = Game.res.opponent[id];
  const fx = Object.assign({}, OPPONENT.fx);
  fx.sprites.rows = config.rows;

  const stats = {
    name: config.name,
    health: config.health,
    cooldown: config.cooldown,
  };
  const spellID = getRandomValue(this.options.mob_spells);
  const spell = new Spell(spellID);

  return new Opponent(image, fx, stats, spell, this.player);
};

// -------------- WIN / LOSE

Game.prototype.isWon = function () {
  return this.killcount >= this.options.mob_count;
};

Game.prototype.isLost = function () {
  return this.player.isDead();
};

// If win/lose conditions met and subsequent animations are also complete.
Game.prototype.isLevelComplete = function () {
  return (this.isWon() || this.isLost()) && this.STOPPED;
};

Game.prototype.saveProgress = function () {
  const profile = this.screen.profile;

  if (this.level < profile.level_progress) {
    profile.gold += this.options.payout * 0.1;
  } else {
    profile.gold += this.options.payout;
    profile.level_progress = this.level + 1;
  }

  this.screen.setProfile(profile);
};

// -------------- MISC

Game.prototype.areOnTargetPos = function () {
  return this.player.isAtTargetPos() && this.opponent.isAtTargetPos();
};

Game.prototype.areAlive = function () {
  return !this.player.isDead() && !this.opponent.isDead();
};

Game.prototype.areInCombatPos = function () {
  return this.player.isInCombatPos() && this.opponent.isInCombatPos();
};

Game.prototype.areInCombat = function () {
  return this.areAlive() && this.areInCombatPos();
};

// -------------- OLD

// Game.prototype.input = function (value) {
//   if (!Game.STOPPED && !Game.isLevelEnded()) {
//     this.lastKeyPressed = value;
//   }
// };

// Game.isLevelEnded = function () {
//   return Game.instance.isWon() || Game.instance.isLost();
// };

// Game.setInstance = function (lang, level) {
//   level = level || profile.level_progress;

//   if (!Game.instance || Game.instance.selectedLevel !== level) {
//     return Game.load().then(function () {
//       Game.instance = new Game(lang, profile);

//       return Game.instance;
//     });
//   } else {
//     return Game.instance;
//   }
// };

// Game.input = function (value) {
//   if (!Game.STOPPED && !Game.isLevelEnded()) {
//     Game.instance.lastKeyPressed = value;
//   }
// };

// Game.quitInstance = function () {
//   const instance = Game.instance;

//   if (instance) {
//     Game.STOPPED = true;
//   }
// };

// Game.pauseInstance = function () {
//   if (Game.instance) {
//     Game.setPause(!Game.PAUSED);
//   }
// };

// Game.resetInstance = function () {
//   const instance = Game.instance;

//   if (instance) {
//     instance.setLevel(Game.selectedLevel);
//   }
// };

// Game.setLevel = function (level) {
//   Game.selectedLevel = level;
//   Game.instance.setLevel(level);
// };

// Level.prototype.gameloop = function (tickrate) {
//   const self = this;

//   var gameID = setInterval(function () {
//     var now = Date.now();
//     var deltaTime = (now - self.lastUpdate) / 1000;
//     self.lastUpdate = now;

//     // ON WIN OR LOSE
//     if (self.isWon() || self.isLost()) {
//       if (!self.endDelay) {
//         self.endDelay = DISPLAY.other.delays.end_delay;
//         self.setStatus(self.isWon() ? "status_victory" : "status_defeat");

//         if (self.isWon()) {
//           self.player.setDestination(self.player.positions.end);
//           self.profile.level_progress = Math.min(
//             self.profile.level_progress + 1,
//             LEVELS.length - 1
//           );
//         }
//       } else if (self.endDelay > 0) {
//         self.endDelay -= deltaTime;
//       } else {
//         Level.STOPPED = true;
//       }
//     }

//     if (!Level.STOPPED) {
//       if (!Level.PAUSED) {
//         self.update(deltaTime);
//       }

//       self.render();
//     } else {
//       clearInterval(gameID);
//       saveProfile(self.profile);
//       changeScreen(SCREENS.GAME, SCREENS.MAP);
//     }
//   }, tickrate);
// };

// -----------------------------------

// Level.prototype.gameloop = function (currentTime) {
//   if (this.isLevelComplete()) {
//     if (this.isWon()) {
//       profile.level_progress = Math.min(
//         profile.level_progress + 1,
//         LEVELS.length - 1
//       );
//     }

//     saveProfile(profile);
//     Level.STOPPED = true;
//   }

//   const deltaTime = (currentTime - this.lastUpdate) / 1000;
//   this.lastUpdate = currentTime;

//   if (!Level.STOPPED) {
//     this.update(deltaTime);
//     this.render();
//   }

//   requestAnimationFrame(this.gameloop.bind(this));
// };

// Level.prototype.renderUI = function () {
//   const ctx = surface.ctx;
//   const settings = UI.killcount;
//   const value = settings.value + this.killcount;
//   const x = settings.x;
//   const y = settings.y;

//   ctx.font = settings.font;
//   ctx.fillStyle = settings.fillStyle;
//   ctx.textAlign = settings.textAlign;
//   ctx.textBaseline = settings.textBaseline;
//   ctx.fillText(value, x, y);
// };

// -------------- OTHER

// Level.prototype.checkOpponentSpawn = function (deltaTime) {
//   if (!this.player.isOnTargetPos() && !this.opponent) {
//     if (this.spawnTimer > 0) {
//       this.spawnTimer -= deltaTime;
//       return false;
//     }
//   }

//   return true;
// };

// Level.prototype.spawnMob = function () {
//   const mob = this.getRandomOpponent();

//   this.opponent.push(mob);
//   this.spawnTimer = this.opponents.mob_cd;
// };
