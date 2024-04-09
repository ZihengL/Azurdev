

function SpriteHandler(resources) {
  this.cv = resources.cv;
  this.layouts = resources.coordinates;

  this.layout = this.layouts.walk;
  this.frame = 0;
  this.coordinates = new Vector2D(0, this.layout.offset);
}
SpriteHandler.debug = false;
SpriteHandler.loaded = {};

// =============================== STATIC

SpriteHandler.createInstance = function (file) {
  if (!SpriteHandler.loaded.hasOwnProperty(file)) {
    SpriteHandler.loaded[file] = loadUnit(file);
  }

  return SpriteHandler.loaded[file].then(function (loaded) {
    return new SpriteHandler(loaded);
  });
};

SpriteHandler.preloadResources = function (files) {
  files.forEach(function (file) {
    if (!SpriteHandler.loaded.hasOwnProperty(file)) {
      SpriteHandler.loaded[file] = loadUnit(file);
    }
  });
};

// =============================== INSTANCE

SpriteHandler.prototype.getCurrentFrameCoordinates = function () {
  var { framesize, offset } = this.layout;
  var x = this.frame * framesize;
  var y = DIRECTIONS.indexOf(this.currentDirection) * framesize + offset;

  return [x, y, framesize];
};

SpriteHandler.prototype.update = function (deltaTime, direction) {
  if (deltaTime >= ANIMATION_SPEED) {
    if (++this.frame >= this.layout.framescount) {
      this.frame = 0;
      this.coordinates.x = 0;
    } else {
      this.frame++;
      this.coordinates.x += this.layout.framesize;
    }
  }
};

SpriteHandler.prototype.render = function (surface, position) {
  var framesize = this.layout.framesize;

  surface.ctx.drawImage(
    this.cv,
    this.coordinates.x,
    this.coordinates.y,
    framesize,
    framesize,
    position.x,
    position.y,
    framesize,
    framesize
  );
};
