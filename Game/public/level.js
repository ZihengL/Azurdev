// BACKGROUNDS: RANDOMLY GENERATED LAYERS
// SPECIAL LEVELS ARE STATICALLY DEFINED, OTHERWISE GENERATED

// GET POINTS FOR KILLING AN ENEMY, SPEND IT ON ELEMENTS/POWERS
// BOOK OF SPELLS
// PLAYER STILL NEEDS TO COUNTER ENEMY TYPE ELEMENT

// TODO: SKILL UPDATE/RENDER, PLAYER INTEGRATION, MOB SPAWNING, LEVEL COMPLETION

const LEVELS = [
  {
    types: ["orc_weak", "orc_strong"],
    count: 5,
    mob_cd: 2,
  },
  {
    types: ["orc_strong"],
    count: 2,
    mob_cd: 2,
  },
];

function Level(res, saved, keymap, game) {
  this.res = res;
  this.save = saved;
  this.keymap = keymap;
  this.game = game;
  this.lastUpdate = null;
  this.lastKeyPressed = null;

  this.levelIdx = saved.level_progress;
  this.killcount = 0;
  this.opponents = [];
  this.opponent = null;
  this.player = new Player(res.player, saved, this.opponent, this);

  this.background = new Background(this.res.background);
  this.setLevel(saved.level_progress);
}
Level.div = "level";
Level.STOPPED = false;
Level.res = {};

Level.load = function () {
  return Background.load().then(function (layers) {
    Level.res.background = layers;
  });
};

Level.prototype.setLevel = function (index) {
  // this.opponents = LEVELS[index] || LEVELS[0];
  // this.killcount = 0;
  // this.opponent = this.getRandomOpponent();
  // this.player.opponent = this.opponent;
  index = index <= this.levelIdx ? index : this.save.level_progress;
  this.opponents = LEVELS[index] || LEVELS[0];
  this.killcount = 0;
  this.player = new Player(this.res.player, this.save, null, this);
  this.opponent = this.getRandomOpponent();
  this.player.opponent = this.opponent;
  this.background = new Background(this.res.background);

  document.addEventListener(
    "keydown",
    function (event) {
      const key = this.keymap.casting[event.key];

      if (key) {
        this.lastKeyPressed = key;
      }
    }.bind(this)
  );
};

Level.prototype.gameloop = function (currentTime) {
  if (!Level.STOPPED) {
    switch (true) {
      case this.isWon():
        this.save.level_progress += Math.min(
          this.save.level_progress + 1,
          LEVELS.length - 1
        );
      case this.isWon():
      case this.isLost():
        this.game.save = this.save;
        this.game.saveProfile();
        this.game.switchToMapMenu();
        break;
      default:
        const deltaTime = (currentTime - this.lastUpdate) / 1000;
        this.lastUpdate = currentTime;

        this.update(deltaTime);
        this.render();
        requestAnimationFrame(this.gameloop.bind(this));
    }
  } else {
    console.log("Level.STOPPED =", Level.STOPPED);
  }
};

// -------------- BASIC UPDATE & RENDER

Level.prototype.init = function () {
  this.opponents = LEVELS[this.levelIdx] || LEVELS[0];
  this.killcount = 0;
  this.player = new Player(this.res.player, this.save, null, this);
  this.opponent = this.getRandomOpponent();
  this.player.opponent = this.opponent;

  document.addEventListener(
    "keydown",
    function (event) {
      const key = this.keymap.casting[event.key];

      if (key) {
        this.lastKeyPressed = key;
      }
    }.bind(this)
  );
};

Level.prototype.exit = function () {};

Level.prototype.update = function (deltaTime) {
  // if (this.updatePositions(deltaTime)) {
  this.player.update(deltaTime);
  this.opponent.update(deltaTime);
  // }
  console.log(this.isWon(), this.opponents.count, this.killcount);
  if (this.opponent.isRemovable()) {
    this.killcount++;
    if (!this.isWon()) {
      this.opponent = this.getRandomOpponent();
      this.player.opponent = this.opponent;
    }
  }

  if (this.player.getState() === STATES.RUN) {
    this.background.update(SPRITES.velocity);
  }

  this.lastKeyPressed = null;
};

Level.prototype.render = function () {
  surface.clear();
  this.background.render();
  this.opponent.render();
  this.player.render();
  // this.renderUI();
};

Level.prototype.updatePositions = function (deltaTime) {
  switch (true) {
    case !this.player.isOnTargetPos():
      this.player.spriteHandler.updatePosition();
      this.player.spriteHandler.update(deltaTime, STATES.RUN);
      return false;
    case !this.opponent.isOnTargetPos():
      this.opponent.spriteHandler.updatePosition();
      this.opponent.update(deltaTime, STATES.RUN);
      this.player.spriteHandler.update(deltaTime, STATES.RUN);
      return false;
    default:
      return true;
  }
};

Level.prototype.setOpponent = function () {
  if (!this.opponent || this.opponent.isRemovable()) {
    this.opponent = this.getRandomOpponent();
    this.player.opponent = this.opponent;
  }
};

Level.prototype.renderUI = function () {
  const ctx = surface.ctx;
  const settings = UI.killcount;
  const value = settings.value + this.killcount;
  const x = settings.x;
  const y = settings.y;

  ctx.font = settings.font;
  ctx.fillStyle = settings.fillStyle;
  ctx.textAlign = settings.textAlign;
  ctx.textBaseline = settings.textBaseline;
  ctx.fillText(value, x, y);
};

// -------------- OTHER

Level.prototype.checkOpponentSpawn = function (deltaTime) {
  if (!this.player.isOnTargetPos() && !this.opponent) {
    if (this.spawnTimer > 0) {
      this.spawnTimer -= deltaTime;
      return false;
    }
  }

  return true;
};

// Level.prototype.spawnMob = function () {
//   const mob = this.getRandomOpponent();

//   this.opponent.push(mob);
//   this.spawnTimer = this.opponents.mob_cd;
// };

Level.prototype.getRandomOpponent = function () {
  const rand = Math.floor(Math.random() * this.opponents.types.length);
  const name = this.opponents.types[rand];

  const opp = MOBS[name];
  return new Opponent(
    this.res.opponent,
    opp.stats,
    opp.fx,
    opp.stats.skills,
    this.player,
    this
  );
};

// Level.prototype.isMobPresent = function () {
//   return this.opponent.length > 0;
// };

Level.prototype.areOnTargetPos = function () {
  return this.player.isOnTargetPos() && this.opponent.isOnTargetPos();
};

// -------------- WIN & LOSE

Level.prototype.isWon = function () {
  return this.killcount >= this.opponents.count;
};

Level.prototype.updateOnWin = function () {
  if (this.player.pos.x < surface.width) {
    this.player.pos.x += player.fx.speed;
    return false;
  }

  return true;
};

Level.prototype.isLost = function () {
  return this.player.health === 0;
};
