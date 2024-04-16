function Projectile(position, target, config) {
  const attributes = PROJECTILES[config];

  this.pos = position.copy();
  this.target = target;
  this.velocity = new Vector2D(0, 0);
  this.color = attributes.color;
  this.size = attributes.size;
  this.speed = attributes.speed;
  // this.attributes = PROJECTILES[config];
}

// Projectile.prototype.stats = function () {
//   return this.attributes.stats;
// };

// Projectile.prototype.fx = function () {
//   return this.attributes.fx;
// };

Projectile.prototype.isOnTarget = function () {
  const targetCenter = this.target.pos.center(this.target.size);

  return this.pos.isEqual(targetCenter);
};

Projectile.prototype.update = function (deltaTime) {
  const targetCenter = this.target.pos.center(this.target.size);

  if (!this.pos.isEqual(targetCenter)) {
    const direction = this.pos.direction(targetCenter);
    this.velocity = direction.multiply(this.speed);

    const displacement = this.velocity.multiply(deltaTime);
    this.pos = this.pos.add(displacement);
  }
};

Projectile.prototype.render = function () {
  surface.ctx.beginPath();
  surface.ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
  ctx.fillStyle = vis.color;
  ctx.fill();
  surface.ctx.stroke();
};
