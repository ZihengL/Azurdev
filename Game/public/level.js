// BACKGROUNDS: RANDOMLY GENERATED LAYERS
// SPECIAL LEVELS ARE STATICALLY DEFINED, OTHERWISE GENERATED

// GET POINTS FOR KILLING AN ENEMY, SPEND IT ON ELEMENTS/POWERS
// BOOK OF SPELLS
// PLAYER STILL NEEDS TO COUNTER ENEMY TYPE ELEMENT

// TODO: SKILL UPDATE/RENDER, PLAYER INTEGRATION, MOB SPAWNING, LEVEL COMPLETION

function Level(lang, profile) {
  this.lang = lang || LANGS[0];
  // this.keymap = keymap;
  this.profile = profile;

  this.lastUpdate = null;
  this.lastKeyPressed = null;

  this.killcount = 0;
  this.opponents = [];
  this.opponent = null;
  this.player = new Player(this.profile, this.opponent, this);

  this.background = new Background(Level.res.background);
  this.setLevel(profile.level_progress);
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

        return Skill.load().then(function (res) {
          Level.res.skills = res;
        });
      });
    });
  });
};

Level.setInstance = function (lang, profile, level) {
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

Level.setLevel = function (level) {
  Level.selectedLevel = level;
  Level.instance.setLevel(level);
};

// -------------- SETUP

Level.prototype.setLevel = function (level) {
  this.opponents = LEVELS[level] || LEVELS[0];
  this.killcount = 0;

  this.player = new Player(profile, null, this);
  this.opponent = this.getRandomOpponent();
  this.player.opponent = this.opponent;

  this.background.generate();

  this.paused = false;
  this.stopped = false;
};

Level.prototype.play = function (tickrate) {
  Level.STOPPED = false;
  this.lastUpdate = Date.now();
  this.gameloop(tickrate);
};

Level.prototype.gameloop = function (tickrate) {
  const self = this;

  setInterval(function () {
    var now = Date.now();
    var deltaTime = (now - self.lastUpdate) / 1000;
    self.lastUpdate = now;

    // ON WIN
    // TODO: END LEVEL UPDATES
    if (self.isWon()) {
      if (!self.player.isMovingToEndPos()) {
        self.player.spriteHandler.targetPos = self.player.positions.end;
        this.statusMessage = {};
      }

      if (self.player.isOnTargetPos()) {
        self.profile.level_progress = Math.min(
          self.profile.level_progress + 1,
          LEVELS.length - 1
        );
        Level.STOPPED = true;
      }
    }

    // ON LOSE
    if (self.isLost()) {
      if (!this.statusMessage) {
        this.statusMessage = {};
      }
    }

    if (!self.isLevelComplete()) {
      if (!Level.PAUSED) {
        self.update(deltaTime);
      }
      self.render();
    } else {
      saveProfile(self.profile);
      updateMap();
      setToScreen(SCREENS.MAP);
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

// -------------- RENDER

Level.prototype.render = function () {
  surface.clear();
  this.background.render();
  this.opponent.render();
  this.player.render();
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

Level.prototype.setStatusMessage = function (message, color) {
  this.statusMessage = message;
};

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
