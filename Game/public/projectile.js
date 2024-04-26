function Projectile(position, target, fx) {
  this.pos = position;
  this.target = target;

  this.velocity = new Vector2D(0, 0);
  this.color = fx.color;
  this.size = fx.size;
  this.speed = fx.speed;
  this.target.isTargeted = true;
}

Projectile.prototype.getTargetCenter = function () {
  return this.target.pos.center(this.target.size);
};

Projectile.prototype.isOnTarget = function () {
  return this.pos.isEqual(this.getTargetCenter());
};

Projectile.prototype.update = function (deltaTime) {
  const direction = this.pos.direction(this.getTargetCenter());
  this.velocity = direction.multiply(this.speed);

  const displacement = this.velocity.multiply(deltaTime);
  this.pos = this.pos.add(displacement);
};

Projectile.prototype.render = function () {
  surface.ctx.beginPath();
  surface.ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
  surface.ctx.fillStyle = this.color;
  surface.ctx.fill();
  surface.ctx.stroke();
};
