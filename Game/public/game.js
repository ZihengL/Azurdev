// BACKGROUNDS: RANDOMLY GENERATED LAYERS
// SPECIAL LEVELS ARE STATICALLY DEFINED, OTHERWISE GENERATED

// GET POINTS FOR KILLING AN ENEMY, SPEND IT ON ELEMENTS/POWERS
// BOOK OF SPELLS
// PLAYER STILL NEEDS TO COUNTER ENEMY TYPE ELEMENT

// TODO: SKILL UPDATE/RENDER, PLAYER INTEGRATION, MOB SPAWNING, LEVEL COMPLETION

function Game(lang, profile) {
  this.lang = lang || LANGS[0];
  this.profile = profile || loadProfile();

  this.lastUpdate = null;
  this.lastKeyPressed = null;

  this.background = new Background(Game.res.background);
  this.setLevel(this.profile.level_progress);
}
Game.instance = null;
Game.selectedLevel = 0;
Game.res = {};

Game.STOPPED = false;
Game.PAUSED = false;

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

Game.setInstance = function (lang, level) {
  const profile = loadProfile();
  level = level || profile.level_progress;

  if (!Game.instance || Game.instance.selectedLevel !== level) {
    return Game.load().then(function () {
      Game.instance = new Game(lang, profile);

      return Game.instance;
    });
  } else {
    return Game.instance;
  }
};

Game.input = function (value) {
  if (!Game.STOPPED && !Game.isLevelEnded()) {
    Game.instance.lastKeyPressed = value;
  }
};

Game.quitInstance = function () {
  const instance = Game.instance;

  if (instance) {
    Game.STOPPED = true;
  }
};

Game.pauseInstance = function () {
  if (Game.instance) {
    Game.setPause(!Game.PAUSED);
  }
};

Game.resetInstance = function () {
  const instance = Game.instance;

  if (instance) {
    instance.setLevel(Game.selectedLevel);
  }
};

Game.setLevel = function (level) {
  Game.selectedLevel = level;
  Game.instance.setLevel(level);
};

Game.setPause = function (toPause) {
  Game.PAUSED = toPause || !Game.PAUSED;
  setVisibility(document.getElementById("status_paused"), Game.PAUSED);
};

Game.setStop = function (toStop) {
  Game.STOPPED = toStop || !Game.STOPPED;
};

Game.isLevelEnded = function () {
  return Game.instance.isWon() || Game.instance.isLost();
};

// -------------- SETUP

Game.prototype.setLevel = function (level) {
  this.profile = loadProfile();

  const options = LEVELS[level] || LEVELS[0];
  this.options = options;
  this.opponents = options.opponents;
  this.sequences = options.sequence;
  this.killcount = 0;

  this.player = new Player(this.profile, null);
  this.opponent = this.getRandomOpponent();
  this.player.opponent = this.opponent;

  this.endDelay = null;
  this.background.generate();
};

Game.prototype.play = function (tickrate) {
  Game.STOPPED = false;
  Game.PAUSED = false;

  Game.setLevel(Game.selectedLevel);
  this.lastKeyPressed = null;
  this.lastUpdate = Date.now();
  this.gameloop(tickrate);

  setGameStatusVisibility();
};

Game.prototype.gameloop = function (tickrate) {
  var gameID = setInterval(
    function () {
      var now = Date.now();
      var deltaTime = (now - this.lastUpdate) / 1000;
      this.lastUpdate = now;

      // ON WIN OR LOSE
      if ((this.isWon() || this.isLost()) && this.updateLevelEnd(deltaTime)) {
        Game.STOPPED = true;
      }

      if (!Game.STOPPED) {
        if (!Game.PAUSED) {
          this.update(deltaTime);
        }
        this.render();
      } else {
        this.player.save(this.profile);
        clearInterval(gameID);
        changeScreen(SCREENS.GAME, SCREENS.MAP);
      }
    }.bind(this),
    tickrate
  );
};

// -------------- UPDATE

Game.prototype.update = function (deltaTime) {
  this.player.update(deltaTime, this.lastKeyPressed);
  this.opponent.update(deltaTime);
  this.background.update(this.player.getState());

  if (this.opponent.isRemovable()) {
    this.killcount++;
    this.profile.gold += this.opponent.stats.gold;
    if (!this.isWon()) {
      this.opponent = this.getRandomOpponent();
      this.player.opponent = this.opponent;
    }
  }

  this.lastKeyPressed = null;
};

Game.prototype.updateLevelEnd = function (deltaTime) {
  if (!this.endDelay) {
    this.endDelay = DISPLAY.other.delays.end_delay;
    setGameStatusVisibility(this.isWon() ? "status_victory" : "status_defeat");

    if (this.isWon()) {
      this.player.setTargetPosition(this.player.positions.end);
      this.profile.level_progress = Math.min(
        this.profile.level_progress + 1,
        LEVELS.length - 1
      );
    }

    return false;
  }

  this.endDelay -= deltaTime;
  return this.endDelay <= 0;
};

// -------------- RENDER

Game.prototype.render = function () {
  surface.clear();
  this.background.render();
  this.opponent.render();
  this.player.render();
};

// -------------- GETTERS / SETTERS

Game.prototype.input = function (value) {
  if (!Game.STOPPED && !Game.isLevelEnded()) {
    this.lastKeyPressed = value;
  }
};

Game.prototype.getRandomOpponent = function () {
  return Opponent.generateInstance(
    this.opponents.base,
    this.opponents.modifiers,
    this
  );
};

Game.prototype.setOpponent = function () {
  if (!this.opponent || this.opponent.isRemovable()) {
    this.opponent = this.getRandomOpponent();
    this.player.opponent = this.opponent;
  }
};

Game.prototype.setStatus = function (elemId) {
  DISPLAY.other.game_status.forEach(function (id) {
    const element = document.getElementById(id);

    setVisibility(element, element.id === elemId);
  });
};

// -------------- WIN / LOSE

Game.prototype.isWon = function () {
  return this.killcount >= this.opponents.count;
};

Game.prototype.isLost = function () {
  return this.player.health === 0;
};

// If win/lose conditions met and subsequent animations are also complete.
Game.prototype.isLevelComplete = function () {
  return (
    (this.player.isDead() || this.killcount >= this.opponents.count) &&
    Game.STOPPED
  );
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
