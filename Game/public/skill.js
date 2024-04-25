function Skill(config, player) {
  const skill = SKILLS[config];

  this.name = config;
  this.sequence = skill.sequence;
  this.stats = skill.stats;
  this.fx = skill.fx;

  this.player = player;
  this.projectiles = [];
  this.sequenceIdx = 0;
}

Skill.prototype.update = function (deltaTime) {
  this.projectiles = this.projectiles.filter(
    function (projectile) {
      projectile.update(deltaTime);

      if (projectile.isOnTarget()) {
        projectile.target.applyDamage(this.stats.damage);
        return false;
      }

      return true;
    }.bind(this)
  );
};

Skill.prototype.render = function () {
  this.projectiles.forEach(
    function (projectile) {
      projectile.render();
    }.bind(this)
  );
};

Skill.prototype.inputSequence = function (inputLetter) {
  const currentLetter = this.sequence[this.sequenceIdx];

  console.log(inputLetter, currentLetter);
  if (inputLetter === currentLetter) {
    this.sequenceIdx++;

    if (this.sequenceIdx >= this.sequence.length - 1) {
      const targetMob = this.getTarget();

      this.cast(targetMob);
      this.sequenceIdx = 0;
    }

    return this.sequenceIdx >= this.sequence.length - 1;
  }
};

Skill.prototype.getTarget = function () {
  const mobs = this.player.level.mobs;

  return mobs[0]; // todo: CHANGE THIS
};

Skill.prototype.cast = function (targetMob) {
  const playerCenter = this.player.pos.center(this.player.size);
  const projectile = new Projectile(playerCenter, targetMob, this.fx);

  this.projectiles.push(projectile);
  this.sequenceIdx = 0;
};
