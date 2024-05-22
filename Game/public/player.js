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
  this.name = getInLang(PLAYER.name);

  this.currentSkills = [];
  this.currentIndex = 0;
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

    this.skills.forEach(function (skill) {
      skill.updateCastEffect(deltaTime);
    });
  } else if (this.isDead()) {
    state = STATES.DEATH;
  } else {
    if (this.updateSkills(deltaTime)) {
      state = STATES.CAST;
    } else {
      state = STATES.IDLE;
    }
  }

  this.mana = Math.min(this.mana + this.stats.mana_regen, this.stats.mana);
  this.spriteHandler.update(deltaTime, state);

  console.log("POS", this.spriteHandler.pos, this.spriteHandler.targetPos)
};

Player.prototype.updateSkills = function (deltaTime) {
  const inputValue = this.level.lastKeyPressed;
  var casted = false;

  this.skills.forEach(
    function (skill) {
      skill.update(deltaTime);

      if (skill.inputSequence(inputValue) && this.hasEnoughMana(skill)) {
        skill.cast(this.opponent);
        this.mana -= skill.stats.mana_cost;
        casted = true;
      }

      skill.updateCastEffect(deltaTime);
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

  // if (this.isOnTargetPos()) {
  this.renderUI();
  // }
};

Player.prototype.renderUI = function () {
  // Caster.prototype.renderUI.call(this);
  // this.renderStatusBar(this.ui.mana, this.stats.mana, this.mana);

  const hpfill = document.getElementById("p_health_fill");
  hpfill.style.height = percentage(this.health, this.stats.health) + "%";

  const manaFill = document.getElementById("p_mana_fill");
  manaFill.style.height = percentage(this.mana, this.stats.mana) + "%";
};

// -------------- OTHER

Player.prototype.hasEnoughMana = function (skill) {
  return this.mana >= skill.stats.mana_cost;
};

Player.prototype.toSaveFormat = function () {};
