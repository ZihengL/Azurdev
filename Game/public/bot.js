function Bot() {
  const fx = BOT.fx;

  this.pos = fx.position.copy();
  this.size = fx.size.copy();
  this.max = fx.max;
  this.health = 100;
}

Bot.prototype.applyDamage = function (damage) {
  this.health -= damage;

  return this.health <= 0;
};

Bot.prototype.update = function () {
  if (this.pos.x > this.max) {
    this.pos.x -= BOT.fx.speed;
  }
};

Bot.prototype.render = function () {
  surface.ctx.fillStyle = "purple";
  surface.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};
