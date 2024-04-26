function Mob(config) {
  const mob = MOBS[config] || MOBS.orc_weak;
  this.name = mob.name.en;

  this.stats = mob.stats;
  this.health = this.stats.health;
  this.cooldown = this.stats.cooldown;
  this.skill = new Skill(this.stats.attack);

  this.fx = mob.fx;
  this.pos = this.fx.position.copy();
  this.size = this.fx.size.copy();
  this.targetPosX = this.fx.max;

  this.isTargeted = false;
}

// -------------- UPDATE & RENDER

Mob.prototype.update = function (deltaTime) {
  if (this.pos.x > this.targetPosX) {
    this.pos.x -= this.fx.speed;
  } else {
    if (!this.isOnCD()) {
    } else {
      this.cooldown -= deltaTime;
    }
  }
};

Mob.prototype.render = function () {
  surface.ctx.fillStyle = this.fx.color;
  surface.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};

// -------------- OTHER

Mob.prototype.isOnCD = function () {
  return this.cooldown > 0;
};

Mob.prototype.isDead = function () {
  return this.health <= 0;
};

// Dead and death anim is done
Mob.prototype.isRemovable = function () {
  return this.health <= 0;
};

Mob.prototype.isCombatReady = function () {
  return this.pos.x === this.targetPosX;
};

Mob.prototype.applyEffect = function (stats) {
  const affinity = stats.affinity;
  const damage = stats.damage;
  const weakness = AFFINITIES[this.stats.affinity].weakness;

  console.log(
    this.name,
    " - ",
    "Weakness: " + weakness,
    "Projectile: ",
    affinity
  );
  if (affinity === weakness) {
    this.health -= damage;
  }

  return this.health <= 0;
};
