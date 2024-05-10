function Opponent(image, stats, fx, skills, opponent, level) {
  Caster.call(this, image, stats, fx, skills, opponent);
  this.level = level;

  this.cooldown = this.stats.cooldown;
  this.currentSkill = this.getRandomSkill();
  this.nextSkill = this.getRandomSkill();
}
Opponent.prototype = Object.create(Caster.prototype);
Opponent.prototype.constructor = Opponent;

Opponent.load = function () {
  return loadImage(PLAYER.fx.spritesheet).then(function (image) {
    return image;
  });
};

Opponent.prototype.update = function (deltaTime) {
  var state = this.spriteHandler.state;

  if (this.opponent.isOnTargetPos()) {
    if (!this.isDead()) {
      this.updateSkills(deltaTime);
      this.updateCooldown(deltaTime);
    } else {
      state = STATES.DEATH;
      if (!this.spriteHandler.isStateEqual(state)) {
        this.spriteHandler.setTargetPos(this.spriteHandler.fx.position.end);
      }
    }

    this.spriteHandler.update(deltaTime, state);
  }
};

Opponent.prototype.updateCooldown = function (deltaTime) {
  const isOffCD = this.cooldown > 0;

  if (isOffCD) {
    this.cooldown -= deltaTime;
  } else {
    this.cast();
  }

  return isOffCD;
};

Opponent.prototype.updateSkills = function (deltaTime) {
  this.skills.forEach(function (skill) {
    skill.update(deltaTime);
  });
};

Opponent.prototype.isRemovable = function () {
  const endPos = surface.ratioPosition(this.spriteHandler.fx.position.end);

  return (
    this.isDead() &&
    // this.spriteHandler.pos.isEqual(endPos) &&
    this.isOnTargetPos()
  );
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
  // console.log("BOT CASTING", skill, this.getRandomSkill());
};

// Opponent.prototype.render = function () {
//   Caster.prototype.render.call(this);

//   console.log("RENDERING", this.spriteHandler.pos);
// };
