function Background(layers) {
  this.skyColor = "aqua";

  this.layers = {};
  for (var key in layers) {
    const layer = layers[key];

    this.layers[key] = {
      cv: layer.cv,
      width: layer.cv.width,
      speed: BACKGROUNDS[key],
      pos: 0,
    };
  }
}

Background.loadLayers = function () {
  const layers = {};
  var sequence = Promise.resolve([]);

  BACKGROUNDS.images.forEach(function (imageName) {
    const path = './public/Assets/backgrounds/' + imageName + '.png';

    sequence = sequence.then(function () {
      return loadImage(path).then(function (img) {
        var cv = document.createElement("canvas");
        cv.width = img.naturalWidth;
        cv.height = img.naturalHeight;

        var ctx = cv.getContext("2d");
        ctx.drawImage(img, 0, 0);
        layers[imageName] = {
          cv: cv,
          // width: cv.width,
          // pos: 0,
        };
      });
    });
  });

  return sequence.then(function () {
    return layers;
  });
};

Background.prototype.update = function () {
  for (const key in this.layers) {
    const layer = this.layers[key];

    layer.pos += layer.speed;
    if (layer.pos >= layer.width) {
      layer.pos = 0;
    }
  }
};

Background.prototype.render = function () {
  surface.ctx.fillStyle = this.skyColor;
  surface.ctx.fillRect(0, 0, surface.width, surface.height);

  for (const key in this.layers) {
    const layer = this.layers[key];

    this.drawLayer(layer.cv, layer.pos);
    if (layer.pos > 0) {
      this.drawLayer(layer.cv, layer.pos - layer.width);
    }
  }
};

Background.prototype.drawLayer = function (cv, position) {
  surface.ctx.drawImage(
    cv,
    position,
    0,
    cv.width,
    cv.height,
    0,
    0,
    surface.width,
    surface.height
  );
};
