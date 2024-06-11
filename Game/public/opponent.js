function Opponent(image, stats, fx, name, level) {
  Caster.call(this, image, stats, fx, stats.skills);

  this.level = level;
  this.opponent = this.level.player;
  this.cooldown = this.stats.cooldown;
  this.currentSkill = this.getRandomSkill();
  this.nextSkill = this.getRandomSkill();

  this.name = name;
  this.containers = OPPONENT.fx.containers;
  this.transitionProperty = OPPONENT.fx.transition_property;

  document.getElementById(this.containers.name).textContent =
    this.name.toUpperCase();
  this.damageElement = document.getElementById(this.containers.damage);
  setHidden(this.containers.ui, true);
}
Opponent.prototype = Object.create(Caster.prototype);
Opponent.prototype.constructor = Opponent;

// -------------- STATIC

Opponent.load = function () {
  const opponents = [];
  var sequence = Promise.resolve();

  OPPONENTS.forEach(function (opponent) {
    sequence = sequence.then(function () {
      return loadImage(opponent.spritesheet).then(function (image) {
        opponents.push(image);
      });
    });
  });

  return sequence.then(function () {
    return opponents;
  });
};

Opponent.generateInstance = function (base, modifiers, level) {
  const type = getRandomValue(modifiers.types);
  const strength = getRandomValue(modifiers.strengths);
  const affinity = getRandomValue(modifiers.affinities);
  const typeOptions = OPPONENTS[type];
  const image = Level.res.opponent[type];

  const stats = {
    strength: strength,
    affinity: affinity,
    skills: [affinity + "-" + strength],
    health: base.health * typeOptions.health_multiplier,
    cooldown: base.cooldown * typeOptions.cooldown_multiplier,
    gold: base.gold * typeOptions.gold_multiplier,
  };

  const fx = Object.assign({}, OPPONENT.fx);
  fx.sprites.rows = typeOptions.rows;

  const name = Opponent.generateName(level.lang, typeOptions.name, stats);

  return new Opponent(image, stats, fx, name, level);
};

Opponent.generateName = function (lang, names, options) {
  const adjective = getRandomValue(OPPONENT_NAMES.adjective[lang]);
  const name = names[lang];
  const prefix = OPPONENT_NAMES.prefix[lang];
  const strength = OPPONENT_NAMES.strength[lang][options.strength];
  const affinity = AFFINITIES[options.affinity].name[lang];

  if (lang === LANGS[0]) {
    return (
      adjective + " " + name + " " + prefix + " " + strength + " " + affinity
    );
  }

  return (
    name + " " + adjective + " " + prefix + " " + affinity + " " + strength
  );
};

// -------------- UPDATE

Opponent.prototype.update = function (deltaTime) {
  var state = this.spriteHandler.state;

  if (this.opponent.isOnTargetPos()) {
    if (this.isDead()) {
      state = STATES.DEATH;
      if (this.spriteHandler.isAtEndofAnim(state)) {
        this.spriteHandler.targetPos = this.positions.end;
        setHidden(this.containers.ui, true);
      }
    } else {
      if (this.isOnTargetPos() && !this.opponent.isDead()) {
        setHidden(this.containers.ui, false);

        if (this.updateCooldown(deltaTime)) {
          state = STATES.CAST;
          this.cast();
        }
      } else {
        state = STATES.IDLE;
      }
    }
  }

  if (this.projectiles.length > 0) {
    console.log("PROJ", this.projectiles.length);
  }

  Caster.prototype.update.call(this, deltaTime, state);
};

Opponent.prototype.updateCooldown = function (deltaTime) {
  if (this.cooldown > 0) {
    this.cooldown -= deltaTime;
    return false;
  }

  return true;
};

Opponent.prototype.render = function () {
  Caster.prototype.render.call(this);

  if (this.isOnTargetPos()) {
    this.updateUI();
  }
};

// -------------- RENDER

Opponent.prototype.updateUI = function () {
  Caster.prototype.updateUI.call(this);

  const cdfill = document.getElementById(this.containers.cooldown);

  if (this.isDead() || this.opponent.isDead()) {
    cdfill.style.width = "0%";
  } else {
    cdfill.style.width = percentage(this.cooldown, this.stats.cooldown) + "%";
  }
};

Opponent.prototype.applyEffect = function (damage, affinity) {
  if (affinity !== this.stats.affinity) {
    Caster.prototype.applyEffect.call(this, damage);

    this.cooldown = this.stats.cooldown;
    triggerShakeFX(this.containers.cooldown_container);
  }
};

// -------------- OTHER

Opponent.prototype.isRemovable = function () {
  return this.spriteHandler.pos.isEqual(this.positions.end);
};

Opponent.prototype.getRandomSkill = function () {
  return Math.floor(Math.random() * this.skills.length);
};

Opponent.prototype.cast = function () {
  this.skills[0].createProjectile();
  this.cooldown = this.stats.cooldown;
  triggerFX(document.getElementById("o_cooldown_container"), "bump");
};
