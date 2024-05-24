function Opponent(image, options, opponent, level) {
  Caster.call(
    this,
    image,
    options.stats,
    options.fx,
    options.stats.skills,
    opponent
  );

  this.level = level;
  this.cooldown = this.stats.cooldown;
  this.currentSkill = this.getRandomSkill();
  this.nextSkill = this.getRandomSkill();

  this.name = Opponent.generatedName(this.level.lang, options);
  this.containers = OPPONENT.fx.containers;
  this.transitionProperty = OPPONENT.fx.transition_property;

  document.getElementById(this.containers.name).textContent =
    this.name.toUpperCase();
  setHidden(this.containers.ui, true);
}
Opponent.prototype = Object.create(Caster.prototype);
Opponent.prototype.constructor = Opponent;

// -------------- STATIC

Opponent.load = function () {
  return loadImage(PLAYER.fx.spritesheet).then(function (image) {
    return image;
  });
};

Opponent.generateInstance = function (minStr, maxStr, opponents) {};

Opponent.generatedName = function (lang, options) {
  const adjective = getRandomValue(OPPONENT_NAMES.adjective[lang]);
  const name = options.name[lang];
  const prefix = OPPONENT_NAMES.prefix[lang];
  const strength = OPPONENT_NAMES.strength[lang][options.strength];
  const affinity = AFFINITIES[options.stats.affinity].name[lang];

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

// Opponent.prototype.update = function (deltaTime) {
//   var state = this.spriteHandler.state;

//   if (this.opponent.isOnTargetPos()) {
//     if (this.isDead()) {
//       state = STATES.DEATH;
//       if (this.spriteHandler.isAtEndofAnim(state)) {
//         this.spriteHandler.targetPos = this.positions.end;
//         setHidden(this.containers.ui, true);
//       }
//     } else {
//       if (this.isOnTargetPos() && !this.opponent.isDead()) {
//         setHidden(this.containers.ui, false);
//         this.updateSkills(deltaTime);

//         if (this.updateCooldown(deltaTime)) {
//           state = STATES.CAST;
//           this.cast();
//         }
//       } else {
//         state = STATES.IDLE;
//       }
//     }
//   }

//   this.spriteHandler.update(deltaTime, state);
// };

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
        this.updateSkills(deltaTime);

        if (this.updateCooldown(deltaTime)) {
          state = STATES.CAST;
          this.cast();
        }
      } else {
        state = STATES.IDLE;
      }
    }
  }

  this.spriteHandler.update(deltaTime, state);
};

Opponent.prototype.updateCooldown = function (deltaTime) {
  if (this.cooldown > 0) {
    this.cooldown -= deltaTime;
    return false;
  }

  return true;
};

Opponent.prototype.updateSkills = function (deltaTime) {
  this.skills.forEach(function (skill) {
    skill.update(deltaTime);
  });
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

Opponent.prototype.applyEffect = function (projectile) {
  Caster.prototype.applyEffect.call(this, projectile);

  this.cooldown = this.stats.cooldown;
  triggerShakeFX(this.containers.cooldown_container);
};

// -------------- OTHER

Opponent.prototype.isRemovable = function () {
  return this.spriteHandler.pos.isEqual(this.positions.end);
};

Opponent.prototype.getRandomSkill = function () {
  return Math.floor(Math.random() * this.skills.length);
};

Opponent.prototype.cast = function () {
  const skill = this.skills[this.currentSkill];

  skill.cast(this.opponent);
  this.currentSkill = this.nextSkill;
  this.nextSkill = this.getRandomSkill();
  this.cooldown = this.stats.cooldown;

  triggerShakeFX(this.containers.cooldown);
};
