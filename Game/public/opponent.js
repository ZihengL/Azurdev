function Opponent(image, stats, fx, name, player) {
  Caster.call(this, image, stats, fx, stats.spells, player);

  this.opponent = player;
  this.cooldown = this.stats.cooldown;
  this.currentSpell = this.getRandomSpell();
  this.nextSpell = this.getRandomSpell();

  this.name = name;
  this.elements.name.textContent = this.name.toUpperCase();
  this.elements.ui.classList.add("hidden");
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

Opponent.generateInstance = function (base, modifiers, game) {
  const type = getRandomValue(modifiers.types);
  const strength = getRandomValue(modifiers.strengths);
  const affinity = getRandomValue(modifiers.affinities);
  const typeOptions = OPPONENTS[type];
  const image = Game.res.opponent[type];

  const stats = {
    strength: strength,
    affinity: affinity,
    spells: [affinity + "-" + strength],
    health: base.health * typeOptions.health_multiplier,
    cooldown: base.cooldown * typeOptions.cooldown_multiplier,
    gold: base.gold * typeOptions.gold_multiplier,
  };

  const fx = Object.assign({}, OPPONENT.fx);
  fx.sprites.rows = typeOptions.rows;

  const name = Opponent.generateName(game.lang, typeOptions.name, stats);

  return new Opponent(image, stats, fx, name, game.player);
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
        this.elements.ui.classList.add("hidden");
      }
    } else {
      if (this.isOnTargetPos() && !this.opponent.isDead()) {
        this.elements.ui.classList.remove("hidden");

        if (this.updateCooldown(deltaTime)) {
          state = STATES.CAST;
          this.castSpell(this.spells[0]);
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
  Caster.prototype.updateUI.call(this, "width");

  if (this.isDead() || this.opponent.isDead()) {
    this.elements.cooldown.style.width = "0%";
  } else {
    this.elements.cooldown.style.width =
      percentage(this.cooldown, this.stats.cooldown) + "%";
  }
};

// -------------- STATUS EFFECTS

Opponent.prototype.applyEffect = function (damage, affinity) {
  if (affinity !== this.stats.affinity) {
    Caster.prototype.applyEffect.call(this, damage);

    this.cooldown = this.stats.cooldown;
    triggerFX(this.elements.cooldown_container, "shake");
  }
};

// -------------- MISC

Opponent.prototype.isRemovable = function () {
  return this.spriteHandler.pos.isEqual(this.positions.end);
};

Opponent.prototype.getRandomSpell = function () {
  return Math.floor(Math.random() * this.spells.length);
};

Opponent.prototype.castSpell = function (spell) {
  Caster.prototype.castSpell.call(this, spell);

  this.cooldown = this.stats.cooldown;
  triggerFX(this.elements.cooldown_container, "bump");
};
