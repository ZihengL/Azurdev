function Opponent(image, options, opponent, level) {
  Caster.call(
    this,
    image,
    options.stats,
    options.fx,
    options.stats.skills,
    opponent,
    UI.actors.opponent
  );

  this.level = level;
  this.cooldown = this.stats.cooldown;
  this.currentSkill = this.getRandomSkill();
  this.nextSkill = this.getRandomSkill();

  this.name = Opponent.generatedName(this.level.lang, options);
}
Opponent.prototype = Object.create(Caster.prototype);
Opponent.prototype.constructor = Opponent;

// -------------- STATIC

Opponent.load = function () {
  return loadImage(PLAYER.fx.spritesheet).then(function (image) {
    return image;
  });
};

Opponent.generateInstance = function (minStr, maxStr, opponents) {
  
};

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

Opponent.prototype.update = function (deltaTime) {
  var state = this.spriteHandler.state;

  if (this.opponent.isOnTargetPos()) {
    if (this.isDead()) {
      state = STATES.DEATH;
      if (this.spriteHandler.isAtEndofAnim(state)) {
        this.spriteHandler.targetPos = this.positions.end;
      }
    } else {
      if (this.isOnTargetPos()) {
        this.updateSkills(deltaTime);

        if (this.updateCooldown(deltaTime)) {
          state = STATES.CAST;
          this.cast();
        } else {
          state = STATES.IDLE;
        }
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

Opponent.prototype.renderUI = function () {
  Caster.prototype.renderUI.call(this);
  this.renderStatusBar(this.ui.cooldown, this.stats.cooldown, this.cooldown);
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
};
