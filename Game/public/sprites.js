function SpriteHandler(fx, image, pos, targetPos) {
  this.fx = fx;
  this.image = image;

  this.size = surface.ratioSizing(this.fx.sprites.frame);
  this.pos = pos;
  this.targetPos = targetPos;
  this.center = new Vector2D(this.pos.x, this.pos.y - this.size.y / 2);

  this.state = STATES.IDLE;
  this.index = 0;
  this.lastUpdate = 0;

  this.shadow = false;
}
SpriteHandler.id = "actors";

// -------------- UPDATE

SpriteHandler.prototype.update = function (deltaTime, state) {
  if (this.lastUpdate >= SPRITES.animation_speed) {
    this.lastUpdate = 0;
    this.updateState(state);
  } else {
    this.lastUpdate += deltaTime;
  }

  this.updatePosition();
};

SpriteHandler.prototype.updateState = function (state) {
  const max = this.fx.sprites.rows[this.state] - 1;

  if (this.isStateEqual(STATES.DEATH)) {
    this.index = Math.min(this.index + 1, max);
  } else {
    if (
      (this.isStateEqual(state) || this.isStateEqual(STATES.CAST)) &&
      this.index < max
    ) {
      this.index++;
    } else {
      this.state = state;
      this.index = 0;
    }
  }
};

SpriteHandler.prototype.updatePosition = function () {
  const velocity = SPRITES.velocity;

  if (this.pos.x > this.targetPos.x) {
    this.pos.x = Math.max(this.pos.x - velocity, this.targetPos.x);
  } else {
    this.pos.x = Math.min(this.pos.x + velocity, this.targetPos.x);
  }

  this.center.x = this.pos.x;
  this.center.y =
    this.pos.y - this.size.y / 2 + this.fx.sprites.frame.bleed / 2;
};

// -------------- RENDER

SpriteHandler.prototype.render = function () {
  const sPos = this.getFrameCoordinates();

  surface.drawActor(
    this.image,
    sPos,
    this.pos,
    this.size,
    this.fx.sprites.frame.bleed,
    this.shadow
  );
};

// -------------- POSITIONAL

SpriteHandler.prototype.setTargetPos = function (position) {
  this.targetPos = surface.ratioPosition(position);
};

SpriteHandler.prototype.frameX = function () {
  const sprites = this.fx.sprites;

  return this.index * sprites.frame.width * sprites.scale;
};

SpriteHandler.prototype.frameY = function () {
  const sprites = this.fx.sprites;
  const multiplier = Object.keys(sprites.rows).indexOf(this.state);

  return multiplier * sprites.frame.height * sprites.scale;
};

SpriteHandler.prototype.getFrameCoordinates = function () {
  return new Vector2D(this.frameX(), this.frameY());
};

SpriteHandler.prototype.frameCenter = function () {
  return this.size.divide(2);
};

SpriteHandler.prototype.bodyCenter = function () {
  // const center = this.frameCenter();
  // return new Vector2D(this.pos.x + center.x, this.pos.y - center.y);
  return this.center;
};

// -------------- CONDITIONALS

SpriteHandler.prototype.isResettable = function () {
  return (
    this.isPastLastFrame() &&
    (this.state === STATES.RUN || this.state === STATES.IDLE)
  );
};

SpriteHandler.prototype.isOnTargetPos = function () {
  return this.pos.isEqual(this.targetPos);
};

SpriteHandler.prototype.isAtEndofAnim = function (state) {
  return this.isStateEqual(state) && this.isPastLastFrame();
};

SpriteHandler.prototype.isNotAtEndofAnim = function (state) {
  return this.isStateEqual(state) && !this.isPastLastFrame();
};

SpriteHandler.prototype.isStateEqual = function (state) {
  return this.state === state;
};

SpriteHandler.prototype.isPastLastFrame = function () {
  const framescount = this.fx.sprites.rows[this.state] - 1;

  return this.index >= framescount;
};

SpriteHandler.prototype.triggerDamageGlow = function (isDead) {
  this.shadow = true;

  if (!isDead) {
    setTimeout(
      function () {
        this.shadow = false;
      }.bind(this),
      50
    );
  }
};
