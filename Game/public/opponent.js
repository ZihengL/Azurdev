function Opponent(id, player) {
  const options = OPPONENTS[id];
  console.log()
  Caster.call(this, Game.res.opponent[id], options, OPPONENT.fx, player);

  this.spell = this.opponent = player;
  this.cooldown = this.maxCooldown = options.cooldown;

  this.name = options.name;
  this.elements.name.textContent = this.name[lang].toUpperCase();
  this.elements.ui.classList.add("hidden");
}
Opponent.prototype = Object.create(Caster.prototype);
Opponent.prototype.constructor = Opponent;

// -------------- STATIC

Opponent.load = function () {
  const opponents = [];
  var sequence = Promise.resolve();

  OPPONENTS.forEach(function (opponent) {
    path = "./public/Assets/player/" + opponent.image + ".png";

    sequence = sequence.then(function () {
      return loadImage(path).then(function (image) {
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
  };

  const fx = Object.assign({}, OPPONENT.fx);
  fx.sprites.rows = typeOptions.rows;

  const name = Opponent.generateName(game.lang, typeOptions.name, stats);

  return new Opponent(type, game.player);
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

  if (this.opponent.isAtTargetPos()) {
    if (this.isDead()) {
      state = STATES.DEATH;
      if (this.spriteHandler.isAtEndofAnim(state)) {
        this.spriteHandler.targetPos = this.positions.end;
        this.elements.ui.classList.add("hidden");
      }
    } else {
      if (this.isAtTargetPos() && !this.opponent.isDead()) {
        this.elements.ui.classList.remove("hidden");

        if (this.updateCooldown(deltaTime)) {
          state = STATES.CAST;
          this.castSpell(this.spell);
        }
      } else {
        state = STATES.IDLE;
      }
    }
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

  if (this.isAtTargetPos()) {
    this.updateUI();
  }
};

// -------------- RENDER

Opponent.prototype.updateUI = function () {
  Caster.prototype.updateUI.call(this, "width");

  var cooldownValue = 0;
  if (!this.isDead() && !this.opponent.isDead()) {
    cooldownValue = percentage(this.cooldown, this.maxCooldown);
  }

  this.elements.cooldown.style.width = cooldownValue + "%";
};

// -------------- STATUS EFFECTS

Opponent.prototype.applyEffect = function (damage, affinity) {
  if (affinity !== this.stats.affinity) {
    Caster.prototype.applyEffect.call(this, damage);

    this.cooldown = this.maxCooldown;
    triggerFX(this.elements.cooldown_container, "shake");
  }
};

// -------------- MISC

Opponent.prototype.isRemovable = function () {
  return this.spriteHandler.pos.isEqual(this.positions.end);
};



Opponent.prototype.castSpell = function (spell) {
  Caster.prototype.castSpell.call(this, spell);

  this.cooldown = this.maxCooldown;
  triggerFX(this.elements.cooldown_container, "bump");
};

// Opponent.prototype.getRandomSpell = function () {
//   return Math.floor(Math.random() * this.spells.length);
// };