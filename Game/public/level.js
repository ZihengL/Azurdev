// BACKGROUNDS: RANDOMLY GENERATED LAYERS
// SPECIAL LEVELS ARE STATICALLY DEFINED, OTHERWISE GENERATED

// GET POINTS FOR KILLING AN ENEMY, SPEND IT ON ELEMENTS/POWERS
// BOOK OF SPELLS
// PLAYER STILL NEEDS TO COUNTER ENEMY TYPE ELEMENT

// TODO: SKILL UPDATE/RENDER, PLAYER INTEGRATION, MOB SPAWNING, LEVEL COMPLETION

const LEVELS = [
  {
    mobs_count: 5,
    mob_types: ["orc_weak", "orc_strong"],
  },
];

function Level(index, keymap) {
  this.keymap = keymap;
  this.lastUpdate = null;
  this.lastKeyPressed = null;

  this.level = null;
  this.totalWeight = 0;
  this.background = null;

  this.player = new Player(SKILLS, this);
  this.mobs = [];

  this.setLevel(index);
}

Level.prototype.setLevel = function (index) {
  this.level = LEVELS[index] || LEVELS[0];
  this.totalWeight = this.level.mob_types.reduce((sum, config) => {
    const weight = (MOBS[config] || MOBS.orc_weak).stats.weight;

    sum += weight;
  });

  document.addEventListener(
    "keydown",
    function (event) {
      const key = this.keymap.casting[event.key];

      console.log(event.key, key);

      if (key) {
        this.lastKeyPressed = key;
      }
    }.bind(this)
  );
};

Level.prototype.play = function () {
  loadBackgrounds().then(
    function (layers) {
      this.background = new Background(layers);
      this.lastUpdate = performance.now();
      this.gameloop(this.lastUpdate);
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

Level.prototype.update = function (deltaTime) {
  this.background.update();

  this.player.update(deltaTime, this.lastKeyPressed);
  this.mobs.forEach(function (mob) {
    mob.update(deltaTime);
  });

  if (this.mobs.length === 0) {
    this.spawnMob();
  }

  this.lastKeyPressed = null;
};

Level.prototype.render = function () {
  this.background.render();

  this.mobs.forEach(function (mob) {
    mob.render();
  });
  this.player.render();

  this.renderUI();
};

Level.prototype.renderUI = function () {
  const bar_w = PLAYER.fx.bar_width;
  const bar_h = PLAYER.fx.bar_height;

  const hp_w = bar_w * this.player.health;
  var y = 200;
  surface.ctx.fillStyle = "red";
  surface.ctx.fillRect(centerX(hp_w), y, hp_w, bar_h);

  const mana_w = bar_w * this.player.mana;
  y += bar_h * 2;
  surface.ctx.fillStyle = "blue";
  surface.ctx.fillRect(centerX(mana_w), y, mana_w, bar_h);
};

Level.prototype.isWon = function () {
  return true;
};

Level.prototype.spawnMob = function () {
  const mob = this.getRandomMob();

  this.mobs.push(mob);
};

Level.prototype.getRandomMob = function () {
  const mob_types = this.level.mob_types;
  var random = Math.random() * this.totalWeight;

  for (var i = 0; i < mob_types.length; i++) {
    const mob = MOBS[mob_types[i]];

    random -= mob.stats.weight;
    if (random < 0) {
      return new Mob(mob_types[i]);
    }
  }

  return new Mob();
};
