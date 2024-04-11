function SpriteHandler(file, currentTime) {
  var resources = SpriteHandler.loaded[file];

  this.cv = resources.cv;
  this.layouts = resources.layouts;

  this.frame = 0;
  this.layout = this.layouts.walk;
  this.direction = DIRECTIONS.e.index;
  this.coordinates = new Vector2D(0, this.layout.offset);

  this.lastUpdate = 0;
}
SpriteHandler.debug = false;
SpriteHandler.loaded = {};

// =============================== STATIC

SpriteHandler.createInstance = function (file) {
  if (!SpriteHandler.loaded.hasOwnProperty(file)) {
    loadUnit(file).then(function (resources) {
      SpriteHandler.loaded[file] = resources;
    });
  }

  return SpriteHandler.loaded[file].then(function (resources) {
    return new SpriteHandler(resources);
  });
};

SpriteHandler.preloadResources = function (files) {
  var promises = files.map(function (file) {
    return loadUnit(file).then(function (resources) {
      SpriteHandler.loaded[file] = resources;
    });
  });


  return Promise.all(promises);
};

// =============================== INSTANCE

// SpriteHandler.prototype.updateCoordinates = function (direction) {
//   var angle = (Math.atan2(direction.y, direction.x) * 180) / Math.PI;

//   for (var key in DIRECTIONS) {
//     var polarDirection = DIRECTIONS[key];
//     var intervals = polarDirection.intervals;
//     var min = intervals[0], max = intervals[1];

//     if (angle >= min && angle < max) {
//       this.coordinates.y = this.layout.offset + FRAMESIZE * polarDirection.index;
//     }
//   }
// }

SpriteHandler.prototype.update = function (deltaTime, velocity, action) {
  this.lastUpdate += deltaTime;

  if (this.lastUpdate >= ANIMATION_SPEED) {
    this.lastUpdate = 0;

    if (velocity && this.direction !== velocity) {
      this.coordinates.y = this.layout.offset + FRAMESIZE * velocity.toPolarDirection();
    }
    
    if (this.frame + 1 >= this.layout.framescount) {
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
