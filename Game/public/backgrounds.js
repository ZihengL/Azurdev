function Background(scenes) {
  this.scenes = scenes;
  this.surface = Surface.instance;

  const x = 0;
  const y = this.surface.ratioProportionY(0.75);
  const w = this.surface.ratioProportionX(1);
  const h = this.surface.ratioProportionY(1) - y;
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

      if (pos.x <= -this.surface.width) {
        pos.x = 0;
      }
    }
  }
};

// -------------- RENDER

Background.prototype.render = function () {
  const y = -this.ground.h;

  for (var i = 0; i < this.scene.length; i++) {
    const layer = this.scene[i];
    const pos = layer.position;
    const img = layer.image;

    this.surface.drawTo("backgrounds", img, pos.x, y);
    if (layer.position.x < 0) {
      this.surface.drawTo("backgrounds", img, pos.x + this.surface.width, y);
    }
  }

  const g = this.ground;
  this.surface.layers.backgrounds.ctx.fillStyle = "#5C4033";
  this.surface.layers.backgrounds.ctx.fillRect(g.x, g.y, g.w, g.h);
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
      position: this.surface.ratioPosition(options.position),
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
      position: this.surface.ratioPosition(options.position),
    };
  }
};
