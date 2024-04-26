// BACKGROUNDS: RANDOMLY GENERATED LAYERS
// SPECIAL LEVELS ARE STATICALLY DEFINED, OTHERWISE GENERATED

// GET POINTS FOR KILLING AN ENEMY, SPEND IT ON ELEMENTS/POWERS
// BOOK OF SPELLS
// PLAYER STILL NEEDS TO COUNTER ENEMY TYPE ELEMENT

// TODO: SKILL UPDATE/RENDER, PLAYER INTEGRATION, MOB SPAWNING, LEVEL COMPLETION

const LEVELS = [
  {
    mob_types: ["orc_weak", "orc_strong"],
    mobs_count: 5,
    mob_cd: 2,
  },
  {
    mob_types: ["orc_strong"],
    mobs_count: 2,
    mob_cd: 2,
  },
];

function Level(levelIdx, keymap) {
  this.keymap = keymap;
  this.lastUpdate = null;
  this.lastKeyPressed = null;

  this.levelIdx = levelIdx;
  this.level = null;
  this.spawnTimer = 0;
  this.totalWeight = 0;

  this.background = new Background(Level.res.background);
  this.mobs = [];
  this.player = new Player(this, SKILLS);
  this.killcount = 0;

  this.setLevel(levelIdx);
}
Level.res = {};

Level.load = function () {
  return Background.loadLayers().then(function (layers) {
    Level.res.background = layers;
  });
};

Level.prototype.setLevel = function (index) {
  this.level = LEVELS[index] || LEVELS[0];
  var sum = 0;
  this.totalWeight = this.level.mob_types.reduce((config) => {
    const mob = MOBS[config] || MOBS.orc_weak;

    return sum + mob.stats.weight;
  });

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
  const deltaTime = (currentTime - this.lastUpdate) / 1000;
  this.lastUpdate = currentTime;

  this.update(deltaTime);
  this.render();

  requestAnimationFrame(this.gameloop.bind(this));
};

// -------------- BASIC UPDATE & RENDER

Level.prototype.update = function (deltaTime) {
  if (!this.isInCombat()) {
    this.background.update();
  }

  if (this.isWon()) {
    if (this.updateOnWin()) {
      // SET LEVEL HERE.
    }
  } else if (this.isLost()) {
  } else {
    this.player.update(deltaTime, this.lastKeyPressed);
    this.updateMobs(deltaTime);
    this.lastKeyPressed = null;
  }
};

Level.prototype.render = function () {
  this.background.render();

  this.mobs.forEach(function (mob) {
    mob.render();
  });
  this.player.render();
  this.renderUI();
};

Level.prototype.updateMobs = function (deltaTime) {
  this.mobs = this.mobs.filter(
    function (mob) {
      if (!mob.isDead()) {
        mob.update(deltaTime);
        return true;
      }

      this.killcount++;
      return false;
    }.bind(this)
  );

  if (this.checkMobSpawn(deltaTime)) {
    this.spawnMob();
  }
};

// CREATE A CLASS TO MANAGE UI
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

Level.prototype.checkMobSpawn = function (deltaTime) {
  if (!this.isMobPresent() && !this.isWon()) {
    if (this.spawnTimer > 0) {
      this.spawnTimer = Math.max(this.spawnTimer - deltaTime, 0);
      return false;
    }

    return true;
  }
};

Level.prototype.spawnMob = function () {
  const mob = this.getRandomMob();

  this.mobs.push(mob);
  this.spawnTimer = this.level.mob_cd;
};

Level.prototype.getRandomMob = function () {
  const mob_types = this.level.mob_types;
  var random = Math.random() * this.totalWeight;

  for (var i = 0; i < mob_types.length; i++) {
    const mob = MOBS[mob_types[i]];

    random -= mob.stats.weight;
    console.log(random, mob.stats.weight);
    if (random < 0) {
      return new Mob(mob_types[i]);
    }
  }

  return new Mob();
};

Level.prototype.isMobPresent = function () {
  return this.mobs.length > 0;
};

Level.prototype.isInCombat = function () {
  const mob = this.mobs[0];

  return mob && mob.isCombatReady();
};

// -------------- WIN & LOSE

Level.prototype.isWon = function () {
  return this.killcount >= this.level.mobs_count;
};

Level.prototype.updateOnWin = function () {
  if (this.player.pos.x < surface.width) {
    this.player.pos.x += 5;

    return false;
  }

  return true;
};

Level.prototype.isLost = function () {
  return this.player.health === 0;
};
