// BACKGROUNDS: RANDOMLY GENERATED LAYERS
// SPECIAL LEVELS ARE STATICALLY DEFINED, OTHERWISE GENERATED

// GET POINTS FOR KILLING AN ENEMY, SPEND IT ON ELEMENTS/POWERS
// BOOK OF SPELLS
// PLAYER STILL NEEDS TO COUNTER ENEMY TYPE ELEMENT

// TODO: SKILL UPDATE/RENDER, PLAYER INTEGRATION, MOB SPAWNING, LEVEL COMPLETION

function Level(lang, profile) {
  this.lang = lang || LANGS[0];
  this.profile = loadProfile();

  this.lastUpdate = null;
  this.lastKeyPressed = null;

  this.background = new Background(Level.res.background);
  this.setLevel(this.profile.level_progress);
}
Level.STOPPED = false;
Level.PAUSED = false;

Level.instance = null;
Level.selectedLevel = 0;
Level.res = {};

// -------------- STATIC

Level.load = function () {
  return Background.load().then(function (res) {
    Level.res.background = res;

    return Player.load().then(function (res) {
      Level.res.player = res;

      return Opponent.load().then(function (res) {
        Level.res.opponent = res;

        // return Skill.load().then(function (res) {
        //   Level.res.skills = res;
        // });
      });
    });
  });
};

Level.setInstance = function (lang, level) {
  const profile = loadProfile();
  level = level || profile.level_progress;

  if (!Level.instance || Level.instance.selectedLevel !== level) {
    return Level.load().then(function () {
      Level.instance = new Level(lang, profile);

      return Level.instance;
    });
  } else {
    return Level.instance;
  }
};

Level.quitInstance = function () {
  const instance = Level.instance;

  if (instance) {
    Level.STOPPED = true;
  }
};

Level.pauseInstance = function () {
  if (Level.instance) {
    Level.setPause(!Level.PAUSED);
  }
};

Level.resetInstance = function () {
  const instance = Level.instance;

  if (instance) {
    instance.setLevel(Level.selectedLevel);
  }
};

Level.setLevel = function (level) {
  Level.selectedLevel = level;
  Level.instance.setLevel(level);
};

Level.setPause = function (toPause) {
  Level.PAUSED = toPause || !Level.PAUSED;
  setVisibility(document.getElementById("status_paused"), Level.PAUSED);
};

Level.setStop = function (toStop) {
  Level.STOPPED = toStop || !Level.STOPPED;
};

// -------------- SETUP

Level.prototype.setLevel = function (level) {
  this.profile = loadProfile();

  const options = LEVELS[level] || LEVELS[0];
  this.opponents = options.opponents;
  this.sequences = options.sequence;
  this.killcount = 0;

  this.player = new Player(this.profile, null, this);
  this.opponent = this.getRandomOpponent();
  this.player.opponent = this.opponent;

  this.endDelay = null;
  this.background.generate();
};

Level.prototype.play = function (tickrate) {
  Level.STOPPED = false;
  Level.PAUSED = false;

  this.setStatus();
  this.lastKeyPressed = null;

  this.lastUpdate = Date.now();
  this.gameloop(tickrate);
};

Level.prototype.gameloop = function (tickrate) {
  const self = this;

  var gameID = setInterval(function () {
    var now = Date.now();
    var deltaTime = (now - self.lastUpdate) / 1000;
    self.lastUpdate = now;

    // ON WIN OR LOSE
    Level.STOPPED =
      (self.isWon() || self.isLost()) && self.updateLevelEnd(deltaTime);

    if (!Level.STOPPED) {
      if (!Level.PAUSED) {
        self.update(deltaTime);
      }
      self.render();
    } else {
      clearInterval(gameID);
      saveProfile(self.profile);
      changeScreen(SCREENS.GAME, SCREENS.MAP);
    }
  }, tickrate);
};

// -------------- UPDATE

Level.prototype.update = function (deltaTime) {
  this.player.update(deltaTime);
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

Level.prototype.updateLevelEnd = function (deltaTime) {
  if (!this.endDelay) {
    this.endDelay = DISPLAY.other.delays.end_delay;
    this.setStatus(this.isWon() ? "status_victory" : "status_defeat");

    if (this.isWon()) {
      this.player.setDestination(this.player.positions.end);
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

Level.prototype.render = function () {
  surface.clear();
  this.background.render();
  this.opponent.render();
  this.player.render();
};

// -------------- SEQUENCING

Level.prototype.input = function (value) {
  this.lastKeyPressed = value;
};

Level.prototype.generateSequence = function () {
  this.sequence = [];
  this.currentIndex = 0;

  for (var i = 0; i < this.sequences.length; i++) {
    this.sequence.push(getRandomValue(SEQUENCE));
  }
};

Level.prototype.checkSequence = function () {
  const currentValue = this.sequence[this.currentIndex];

  if (value === currentValue) {
    this.currentIndex++;
    return true;
  }

  return !value;
};

Level.prototype.isSequenceComplete = function () {
  return this.currentIndex >= this.sequence.length;
};

// -------------- WIN & LOSE

Level.prototype.isWon = function () {
  return this.killcount >= this.opponents.count;
};

Level.prototype.isLost = function () {
  return this.player.health === 0;
};

// If win/lose conditions met and subsequent animations are also complete.
Level.prototype.isLevelComplete = function () {
  return (
    (this.player.isDead() || this.killcount >= this.opponents.count) &&
    Level.STOPPED
  );
};

// -------------- OPPONENT

Level.prototype.setOpponent = function () {
  if (!this.opponent || this.opponent.isRemovable()) {
    this.opponent = this.getRandomOpponent();
    this.player.opponent = this.opponent;
  }
};

Level.prototype.getRandomOpponent = function () {
  const key = getRandomValue(this.opponents.types);
  const options = OPPONENTS[key];

  return new Opponent(Level.res.opponent, options, this.player, this);
};

// -------------- OTHER

Level.prototype.areOnTargetPos = function () {
  return this.player.isOnTargetPos() && this.opponent.isOnTargetPos();
};

Level.prototype.areAlive = function () {
  return !this.player.isDead() && !this.opponent.isDead();
};

Level.prototype.areInCombatPos = function () {
  return this.player.isInCombatPos() && this.opponent.isInCombatPos();
};

Level.prototype.areInCombat = function () {
  return this.areAlive() && this.areInCombatPos();
};

Level.prototype.setStatus = function (elemId) {
  for (key in DISPLAY.other.game_status) {
    const element = document.getElementById(key);

    setVisibility(element, element.id === elemId);
  }
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
