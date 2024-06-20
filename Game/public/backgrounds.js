function Background(scenes) {
  // this.skyColor = "aqua";
  this.scenes = scenes;
  this.generate();

  const x = 0;
  const y = surface.ratioProportionY(0.75);
  const w = surface.ratioProportionX(1);
  const h = surface.ratioProportionY(1) - y;

  this.ground = { x, y, w, h };
}

// -------------- STATIC

Background.load = function () {
  const scenes = {};
  var sequence = Promise.resolve();

  for (const key in BACKGROUNDS) {
    const scene = BACKGROUNDS[key];
    scenes[key] = [];

    for (var i = 0; i < scene.length; i++) {
      const path = "./public/Assets/backgrounds/" + key + "/" + i + ".png";

      sequence = sequence.then(function () {
        return loadImage(path).then(function (image) {
          scenes[key].push(image);
        });
      });
    }
  }

  return sequence.then(function () {
    return scenes;
  });
};

// -------------- UPDATE

Background.prototype.update = function (state) {
  const velocity = 2.5;

  for (var i = 0; i < this.scene.length; i++) {
    const layer = this.scene[i];
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
  // surface.fillTo("backgrounds", this.skyColor);

  for (var i = 0; i < this.scene.length; i++) {
    const layer = this.scene[i];
    const pos = layer.position;

    surface.drawTo("backgrounds", layer.image, pos.x, 0);
    if (layer.position.x < 0) {
      surface.drawTo("backgrounds", layer.image, pos.x + surface.width, 0);
    }
  }

  const g = this.ground;
  surface.layers.backgrounds.ctx.fillStyle = "#5C4033";
  surface.layers.backgrounds.ctx.fillRect(g.x, g.y, g.w, g.h);
};

// -------------- OTHER

Background.prototype.setScene = function (key) {
  const scene = BACKGROUNDS[key];

  this.scene = [];
  for (var i = 0; i < scene.length; i++) {
    const options = scene[i];

    this.scene[i] = {
      image: this.scenes[key][i],
      multiplier: options.multiplier,
      grounded: options.grounded,
      position: surface.ratioPosition(options.position),
    };
  }
};

Background.prototype.generate = function () {
  const keys = Object.keys(BACKGROUNDS);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const scene = BACKGROUNDS[key];

  this.scene = [];
  for (var i = 0; i < scene.length; i++) {
    const options = scene[i];

    this.scene[i] = {
      image: this.scenes[key][i],
      multiplier: options.multiplier,
      grounded: options.grounded,
      position: surface.ratioPosition(options.position),
    };
  }
};