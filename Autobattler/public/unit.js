function Unit(file, spawnpoint, currentTime) {
  this.spriteHandler = new SpriteHandler(file, currentTime);

  this.health = 100;
  this.speed = 50;

  this.position = new Vector2D(spawnpoint.x, spawnpoint.y);
  this.velocity = new Vector2D(0, 0);
  this.target = null;
}

// range, 

// =============================== STATIC

Unit.createInstance = function (file, x, y, currentTime) {
  var spriteHandler = SpriteHandler.createInstance(file, currentTime);

  return new Unit(spriteHandler, x, y);
};

// =============================== INSTANCE

Unit.prototype.update = function (deltaTime) {
  if (this.target) {
    var direction = this.position.direction(this.target);
    this.velocity = direction.multiply(this.speed);

    var displacement = this.velocity.multiply(deltaTime);
    this.position = this.position.add(displacement);
  }

  this.spriteHandler.update(deltaTime, this.velocity);
}

Unit.prototype.render = function (surface) {
  this.spriteHandler.render(surface, this.position);
}

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
