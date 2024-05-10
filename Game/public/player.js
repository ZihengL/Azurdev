function Player(image, saved, opponent, level) {
  Caster.call(this, image, saved.stats, PLAYER.fx, saved.skills, opponent);
  this.level = level;

  this.mana = this.stats.mana;
  this.velocity = 0;
  this.endPos = surface.ratioPosition(PLAYER.fx.position.end);
}
Player.prototype = Object.create(Caster.prototype);
Player.prototype.constructor = Player;

Player.load = function () {
  return loadImage(PLAYER.fx.spritesheet).then(function (image) {
    return image;
  });
};

Player.prototype.update = function (deltaTime) {
  var state = this.spriteHandler.state;

  if (this.isOnTargetPos() && this.opponent.isOnTargetPos()) {
    if (!this.isDead()) {
      if (this.updateSkills(deltaTime)) {
        state = STATES.CAST;
      } else {
        state = STATES.IDLE;
      }
    } else {
      state = STATES.DEATH;
    }
  } else {
    state = STATES.RUN;
  }

  this.mana = Math.min(this.mana + this.stats.mana_regen, this.stats.mana);
  // this.spriteHandler.updatePosition();
  this.spriteHandler.update(deltaTime, state);

  // console.log(this.spriteHandler.state, state);
};

Player.prototype.updateSkills = function (deltaTime) {
  const inputValue = this.level.lastKeyPressed;
  var casted = false;

  this.skills.forEach(
    function (skill) {
      if (skill.inputSequence(inputValue) && this.hasEnoughMana(skill)) {
        skill.cast(this.opponent);
        this.mana -= skill.stats.mana_cost;
        // this.spriteHandler.updateState(STATES.CAST);
        casted = true;
      }
      skill.update(deltaTime);
    }.bind(this)
  );

  // console.log(this.spriteHandler.state, casted || this.spriteHandler.isNotAtEndofAnim(STATES.CAST));

  return casted || this.spriteHandler.isNotAtEndofAnim(STATES.CAST);
};

Player.prototype.hasEnoughMana = function (skill) {
  return this.mana >= skill.stats.mana_cost;
};

Player.prototype.toSaveFormat = function () {};
