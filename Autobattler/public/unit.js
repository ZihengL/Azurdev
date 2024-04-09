function Unit(spriteHandler, x, y) {
  this.spriteHandler = spriteHandler;
  this.position = new Vector2D(x, y);
  this.velocity = new Vector2D(0, 0);

  this.health = 100;
  this.speed = 5;
}

// =============================== STATIC

Unit.createInstance = function (file, x, y) {
  var spriteHandler = SpriteHandler.createInstance(file);

  return new Unit(spriteHandler, x, y);
};

// =============================== INSTANCE

Unit.prototype.update = function (deltaTime) {
  this.position = this.position.add(this.velocity.multiply(deltaTime));

  if (Math.abs(this.velocity.x) < 0.01 && Math.abs(this.velocity.y) < 0.01) {
    this.velocity = new Vector2D(0, 0);
  }

  this.spriteHandler.update(this.position);
};

Unit.prototype.isDead = function () {
  return this.health <= 0;
};

Unit.prototype.applyDamage = function (amount) {
  this.health -= amount;

  return this.isDead();
};

Unit.prototype.move = function (direction) {
  this.velocity = direction.multiply(this.speed);
  this.position = this.position.add(this.velocity);
};
