function Opponent(image, fx, stats, spell, player) {
  Caster.call(this, image, fx, stats, player);

  this.spell = spell;
  this.cooldown = stats.cooldown;

  this.name = stats.name[lang];
  this.elements.name.textContent = this.name;
  this.elements.ui.classList.add("hidden");

  const affinityImage = Game.res.affinities[this.spell.affinity].src;
  document.getElementById("opponent_affinity").src = affinityImage;

  player.opponent = this;
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

Opponent.generateName = function (lang, names, options) {
  const adjective = getRandomValue(OPPONENT_NAMES.adjective[lang]);
  const name = names[lang];
  const prefix = OPPONENT_NAMES.prefix[lang];
  const strength = OPPONENT_NAMES.strength[lang][options.strength];
  const affinity = AFFINITIES[options.affinity].name[lang];

  var order = [];
  switch (lang) {
    case 1:
      order = [adjective, name, prefix, strength, affinity];
      break;
    case 2:
      order = [name, adjective, prefix, affinity, strength];
      break;
    default:
      console.log("Unrecognized language:", lang);
  }

  var result = "";
  for (const word in order) {
    result += word + " ";
  }

  return result.substring(0, result.length - 1);
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
  if (this.cooldown <= 0) {
    return true;
  }

  if (this.opponent.projectiles.length === 0) {
    this.cooldown -= deltaTime;
  }

  return false;
};

// -------------- RENDER

Opponent.prototype.render = function () {
  Caster.prototype.render.call(this);

  if (this.isAtTargetPos()) {
    this.updateUI();
  }
};

Opponent.prototype.updateUI = function () {
  Caster.prototype.updateUI.call(this, "width");

  var cooldownValue = 0;
  if (!this.isDead() && !this.opponent.isDead()) {
    cooldownValue = percentage(this.cooldown, this.stats.cooldown);
  }

  this.elements.cooldown.style.width = cooldownValue + "%";
};

// -------------- SPELLS

Opponent.prototype.resetCooldown = function (effect, time) {
  this.cooldown = this.stats.cooldown;
  triggerFX(this.elements.cooldown_container, effect, time);
};

Opponent.prototype.castSpell = function (spell) {
  Caster.prototype.castSpell.call(this, spell);
  this.resetCooldown("bump", 250);
};

Opponent.prototype.applyEffect = function (damage, affinity) {
  if (affinity === this.spell.affinity) {
    damage = 0;
  } else {
    this.resetCooldown("shake", 500);
  }

  Caster.prototype.applyEffect.call(this, damage);
};

// -------------- MISC

// Opponent.prototype.isRemovable = function () {
//   return this.spriteHandler.pos.isEqual(this.positions.end);
// };

// Opponent.generateInstance = function (base, modifiers, game) {
//   const type = getRandomValue(modifiers.types);
//   const strength = getRandomValue(modifiers.strengths);
//   const affinity = getRandomValue(modifiers.affinities);
//   const typeOptions = OPPONENTS[type];
//   const image = Game.res.opponent[type];

//   const stats = {
//     strength: strength,
//     affinity: affinity,
//     spells: [affinity + "-" + strength],
//     health: base.health * typeOptions.health_multiplier,
//     cooldown: base.cooldown * typeOptions.cooldown_multiplier,
//   };

//   const fx = Object.assign({}, OPPONENT.fx);
//   fx.sprites.rows = typeOptions.rows;

//   const name = Opponent.generateName(game.lang, typeOptions.name, stats);

//   return new Opponent(type, game.player);
// };
