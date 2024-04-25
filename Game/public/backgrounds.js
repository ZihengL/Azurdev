function loadBackgrounds() {
  var sequence = Promise.resolve([]);
  var backgrounds = {};

  BACKGROUNDS.images.forEach(function (imageName, index) {
    var path = `./public/Assets/backgrounds/${imageName}.png`;

    sequence = sequence.then(function () {
      return loadImage(path).then(function (img) {
        var cv = document.createElement("canvas");
        cv.width = img.naturalWidth;
        cv.height = img.naturalHeight;

        var ctx = cv.getContext("2d");
        ctx.drawImage(img, 0, 0);
        backgrounds[imageName] = {
          cv: cv,
          position: 0,
          speed: BACKGROUNDS[imageName],
        };
      });
    });
  });

  return sequence.then(function () {
    return backgrounds;
  });
}

function drawBackground(ctx, canvas, x) {
  ctx.drawImage(
    canvas,
    x,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    surface.cv.width,
    surface.cv.height
  );
}

function renderWithParallax(surface, backgrounds, offset) {
  surface.ctx.fillStyle = "aqua";
  surface.ctx.fillRect(0, 0, surface.cv.width, surface.cv.height);

  var keys = Object.keys(backgrounds);
  for (var i = keys.length - 1; i >= 0; i--) {
    const background = backgrounds[keys[i]];
    const canvas = background.cv;
    const speed = background.speed;
    const position = (offset * speed) % canvas.width;

    drawBackground(surface.ctx, canvas, position);
    if (position > 0)
      drawBackground(surface.ctx, canvas, position - canvas.width);
  }

  offset += 3;
  return offset > backgrounds.far.width ? 0 : offset;
}

function Background(layers) {
  this.layers = Object.assign({}, layers);
  this.offset = 0;
  this.skyColor = "aqua";
}

Background.prototype.update = function () {
  for (var key in this.layers) {
    const layer = this.layers[key];

    layer.position = (this.offset * layer.speed) % layer.cv.width;
  }

  this.offset += BACKGROUNDS.increment;
  if (this.offset > BACKGROUNDS.max_width) {
    this.offset = 0;
  }
};

Background.prototype.render = function () {
  surface.ctx.fillStyle = this.skyColor;
  surface.ctx.fillRect(0, 0, surface.width, surface.height);

  for (var key in this.layers) {
    const layer = this.layers[key];

    this.drawLayer(layer.cv, layer.position);
    if (layer.position > 0) {
      this.drawLayer(layer.cv, layer.position - surface.width);
    }
  }
};

Background.prototype.drawLayer = function (layer, position) {
  surface.ctx.drawImage(
    layer,
    position,
    0,
    surface.width,
    surface.height,
    0,
    0,
    surface.width,
    surface.height
  );
};
