function Background(themes) {
  this.skyColor = "aqua";
  this.themes = themes;
  this.generate();

  const x = 0;
  const y = surface.ratioProportionY(0.75);
  const w = surface.ratioProportionX(1);
  const h = surface.ratioProportionY(1) - y;

  this.ground = {
    x,
    y,
    w,
    h,
  };
}
Background.id = "backgrounds";

// -------------- STATIC

Background.load = function () {
  const themes = {};
  var sequence = Promise.resolve();

  // for (const key in BACKGROUNDS.layers) {
  //   const layer = BACKGROUNDS.layers[key];
  //   layers[key] = [];

  //   layer.images.forEach(function (imgfile) {
  //     sequence = sequence.then(function () {
  //       return loadImage(BACKGROUNDS.path + imgfile).then(function (image) {
  //         layers[key].push(image);
  //       });
  //     });
  //   });
  // }

  for (const key in BACKGROUNDS.themes) {
    const theme = BACKGROUNDS.themes[key];
    themes[key] = [];

    theme.forEach(function (layer) {
      sequence = sequence.then(function () {
        return loadImage(BACKGROUNDS.path + layer.image).then(function (image) {
          themes[key].push(image);
        });
      });
    });
  }

  return sequence.then(function () {
    return themes;
  });
};

// -------------- UPDATE

Background.prototype.update = function (state) {
  const velocity = SPRITES.velocity;

  // for (const key in this.current) {
  //   const layer = this.current[key];
  //   const pos = layer.position;

  //   if (state === STATES.RUN || !layer.grounded) {
  //     pos.x -= layer.multiplier * velocity;

  //     if (pos.x <= -surface.width) {
  //       pos.x = 0;
  //     }
  //   }
  // }

  for (var i = 0; i < this.theme.length; i++) {
    const layer = this.theme[i];
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

  // for (const key in this.current) {
  //   const layer = this.current[key];
  //   const pos = layer.position;

  //   surface.drawTo(Background.id, layer.image, pos.x, 0);
  //   if (layer.position.x < 0) {
  //     surface.drawTo(Background.id, layer.image, pos.x + surface.width, 0);
  //   }
  // }

  for (var i = 0; i < this.theme.length; i++) {
    const layer = this.theme[i];
    const pos = layer.position;

    surface.drawTo(Background.id, layer.image, pos.x, 0);
    if (layer.position.x < 0) {
      surface.drawTo(Background.id, layer.image, pos.x + surface.width, 0);
    }
  }

  const g = this.ground;
  surface.layers.backgrounds.ctx.fillStyle = "#5C4033";
  surface.layers.backgrounds.ctx.fillRect(g.x, g.y, g.w, g.h);
};

// -------------- OTHER

Background.prototype.generate = function () {
  // this.current = [];

  // for (const key in this.layers) {
  //   const options = BACKGROUNDS.layers[key];
  //   const image = getRandomValue(this.layers[key]);

  //   this.current[key] = {
  //     image: image,
  //     multiplier: options.multiplier,
  //     grounded: options.grounded,
  //     position: surface.ratioPosition(options.position),
  //   };
  // }
  const keys = Object.keys(BACKGROUNDS.themes);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const theme = BACKGROUNDS.themes[key];

  this.theme = [];
  for (var i = 0; i < theme.length; i++) {
    const options = theme[i];

    this.theme[i] = {
      image: this.themes[key][i],
      multiplier: options.multiplier,
      grounded: options.grounded,
      position: surface.ratioPosition(options.position),
    };
  }
};
