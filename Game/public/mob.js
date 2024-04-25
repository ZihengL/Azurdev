function Mob(config) {
  const mob = MOBS[config] || MOBS.orc_weak;

  this.name = mob.name;
  this.stats = mob.stats;
  this.fx = mob.fx;

  this.pos = this.fx.position.copy();
  this.size = this.fx.size.copy();
  this.max = this.fx.max;
  this.health = 100;

  this.isTargeted = false;
}

Mob.prototype.applyDamage = function (damage) {
  this.health -= damage;

  return this.health <= 0;
};

Mob.prototype.update = function () {
  if (this.pos.x > this.max) {
    this.pos.x -= this.fx.speed;
  }
};

Mob.prototype.render = function () {
  surface.ctx.fillStyle = "purple";
  surface.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};
