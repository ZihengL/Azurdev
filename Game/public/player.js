function Player(saved, opponent, level) {
  Caster.call(
    this,
    Level.res.player,
    saved.stats,
    PLAYER.fx,
    saved.skills,
    opponent
  );

  this.level = level;
  this.mana = this.stats.mana;
  this.manaRegen = this.stats.mana_regen_sec;
  this.regenDelay = 1;

  this.name = getInLang(PLAYER.name);
  this.containers = PLAYER.fx.containers;
  this.transitionProperty = PLAYER.fx.transition_property;
}
Player.prototype = Object.create(Caster.prototype);
Player.prototype.constructor = Player;

// -------------- STATIC

Player.load = function () {
  // const res = {
  //   effects: {},
  // };
  // var sequence = Promise.resolve();

  // loadImage(PLAYER.fx.spritesheet).then(function (image) {
  //   res.sprite = image;

  //   // for (const key in AFFINITIES) {
  //   //   const path = AFFINITIES[key].effect.cast;

  //   //   sequence = sequence.then(function () {
  //   //     return loadImage(path).then(function (image) {
  //   //       res.effects[key] = image;
  //   //     });
  //   //   });
  //   // }
  // });

  // return sequence.then(function () {
  //   return res;
  // });

  return loadImage(PLAYER.fx.spritesheet).then(function (image) {
    return image;
  });
};

// -------------- UPDATE

Player.prototype.update = function (deltaTime) {
  var state = this.spriteHandler.state;

  if (!this.isOnTargetPos() || !this.opponent.isOnTargetPos()) {
    state = STATES.RUN;
  } else if (this.isDead()) {
    state = STATES.DEATH;
  } else {
    if (this.updateSkills(deltaTime)) {
      state = STATES.CAST;
    } else {
      state = STATES.IDLE;
    }
  }

  this.regenDelay -= deltaTime;
  if (this.regenDelay <= 0) {
    this.regenDelay = 1;
    this.mana = Math.min(this.mana + this.manaRegen, this.stats.mana);
  }

  this.spriteHandler.update(deltaTime, state);
};

Player.prototype.checkSequence = function (value) {
  const currentValue = this.sequence[this.currentIndex];

  if (value === currentValue) {
    this.currentIndex++;
    return true;
  }

  return !value;
};

Player.prototype.isSequenceComplete = function () {
  return this.currentIndex >= this.sequence.length;
};

Player.prototype.updateSkills = function (deltaTime) {
  const inputValue = this.level.lastKeyPressed;
  var casted = false;

  this.skills.forEach(
    function (skill, idx) {
      skill.update(deltaTime);

      if (skill.inputSequence(inputValue) && this.hasEnoughMana(skill)) {
        skill.cast(this.opponent);
        this.mana -= skill.stats.mana_cost;
        this.history = [];
        this.currentIndex = 0;
        casted = true;

        this.updateUI();
        triggerFlashFX(skill.stats.affinity);
      } else {
        if (skill.sequenceIdx > highest) {
          highest = skill.sequenceIdx;
          index = idx;
        }
      }
    }.bind(this)
  );

  return casted;
};

// -------------- RENDER

Player.prototype.render = function () {
  this.spriteHandler.render();

  if (!this.isDead()) {
    this.skills.forEach(function (skill) {
      skill.render();
      skill.renderCastEffect();
    });
  }

  this.updateUI();
};

Player.prototype.updateUI = function () {
  Caster.prototype.updateUI.call(this);
  document.getElementById(this.containers.health_text).textContent =
    this.health;

  const manaoverlay = document.getElementById(this.containers.mana_overlay);
  const manafill = document.getElementById(this.containers.mana);
  const manavalue = percentage(this.mana, this.stats.mana) + "%";
  manaoverlay.style.height = manavalue;
  manafill.style.height = manavalue;
  document.getElementById(this.containers.mana_text).textContent = this.mana;
};

// -------------- OTHER

Player.prototype.generateSequence = function () {
  this.sequence = [];

  for (var i = 0; i < this.sequences.length; i++) {
    const value = getRandomValue(SEQUENCE);

    this.sequence.push(value);
  }

  this.currentIndex = 0;
};

Player.prototype.hasEnoughMana = function (skill) {
  if (this.mana >= skill.stats.mana_cost) {
    return true;
  }

  triggerShakeFX(this.containers.mana_container);
  return false;
};

Player.prototype.toSaveFormat = function () {};
