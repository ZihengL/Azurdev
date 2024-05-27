function Projectile(position, target, fx) {
  this.pos = position;
  this.target = target;
  this.fx = fx;

  this.previousPos = this.pos;

  this.velocity = new Vector2D(0, 0);
}

Projectile.prototype.getTargetCenter = function () {
  return this.target.bodyCenter();
};

Projectile.prototype.isOnTarget = function () {
  return this.pos.isEqual(this.target.bodyCenter());
};

Projectile.prototype.update = function (deltaTime) {
  const targetCenter = this.target.bodyCenter();

  if (!this.pos.isEqual(targetCenter)) {
    const direction = this.pos.direction(targetCenter);
    this.velocity = direction.multiply(this.fx.speed);

    const displacement = this.velocity.multiply(deltaTime);
    this.pos = this.pos.add(displacement);

    if (this.pos.x - this.previousPos.x > 10) {
      this.previousPos = this.pos;
    }
  }
};

Projectile.prototype.render = function () {
  if (this.target && !this.target.isDead()) {
    const ctx = surface.layers.effects.ctx;

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.fx.size, 0, 2 * Math.PI);
    ctx.fillStyle = this.fx.color;
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(
      this.previousPos.x,
      this.previousPos.y,
      this.fx.size,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = this.fx.color;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
};

Projectile.prototype.isWithinRange = function () {
  const diff = this.getTargetCenter().distance(this.pos);

  return diff <= this.fx.range;
};
