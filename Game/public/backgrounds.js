function Background(layers) {
  this.skyColor = "aqua";
  this.layers = layers;
  this.generate();
}
Background.id = "backgrounds";

// -------------- STATIC

Background.load = function () {
  const layers = {};
  var sequence = Promise.resolve();

  for (const key in BACKGROUNDS.layers) {
    const layer = BACKGROUNDS.layers[key];
    layers[key] = [];

    layer.images.forEach(function (imgfile) {
      sequence = sequence.then(function () {
        return loadImage(BACKGROUNDS.path + imgfile).then(function (image) {
          layers[key].push(image);
        });
      });
    });
  }

  return sequence.then(function () {
    return layers;
  });
};

// -------------- UPDATE

Background.prototype.update = function (state) {
  const velocity = SPRITES.velocity;

  for (const key in this.current) {
    const layer = this.current[key];
    const pos = layer.position;

    if (state === STATES.RUN || !layer.grounded) {
      pos.x -= layer.multiplier * velocity;

      if (pos.x <= -surface.width) {
        pos.x = 0;
      }
    }
  }
};

// -------------- RENDER

Background.prototype.render = function () {
  surface.fillTo(Background.id, this.skyColor);

  for (const key in this.current) {
    const layer = this.current[key];
    const pos = layer.position;

    surface.drawTo(Background.id, layer.image, pos.x, 0);
    if (layer.position.x < 0) {
      surface.drawTo(Background.id, layer.image, pos.x + surface.width, 0);
    }
  }
};

// -------------- OTHER

Background.prototype.generate = function () {
  this.current = {};

  for (const key in this.layers) {
    const options = BACKGROUNDS.layers[key];
    const image = getRandomValue(this.layers[key]);

    this.current[key] = {
      image: image,
      multiplier: options.multiplier,
      grounded: options.grounded,
      position: surface.ratioPosition(options.position),
    };
  }
};
