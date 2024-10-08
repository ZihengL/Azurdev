function SpriteHandler(image, fx, pos, targetPos) {
  this.fx = fx;
  this.image = image;

  this.size = Surface.instance.ratioSizing(this.fx.sprites.frame);
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
  if (this.lastUpdate >= 0.25) {
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
  const velocity = 2.5;
  const x = this.pos.x;
  const targetX = this.targetPos.x;

  if (this.pos.x > this.targetPos.x) {
    this.pos.x = Math.max(x - velocity, targetX);
  }

  if (this.pos.x < this.targetPos.x) {
    this.pos.x = Math.min(x + velocity, targetX);
  }

  if (x !== this.pos.x) {
    this.center.x = this.pos.x;
    this.center.y =
      this.pos.y - this.size.y / 2 + this.fx.sprites.frame.bleed / 2;
  }
};

// -------------- RENDER

SpriteHandler.prototype.render = function (isDead) {
  const sPos = this.getFrameCoordinates();

  Surface.instance.drawActor(
    this.image,
    sPos,
    this.pos,
    this.size,
    this.fx.sprites.frame.bleed,
    this.shadow && !isDead
  );
};

// -------------- POSITIONAL

SpriteHandler.prototype.setTargetPos = function (position) {
  this.targetPos = Surface.instance.ratioPosition(position);
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

SpriteHandler.prototype.isAtTargetPos = function () {
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
