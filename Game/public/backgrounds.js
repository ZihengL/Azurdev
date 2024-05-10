function Background(layers) {
  this.skyColor = "aqua";
  this.layers = layers;
}
Background.id = "backgrounds";

Background.load = function () {
  const layers = {};
  var sequence = Promise.resolve();

  BACKGROUNDS.images.forEach(function (imageName) {
    const path = "./public/Assets/backgrounds/" + imageName + ".png";

    sequence = sequence.then(function () {
      return loadImage(path).then(function (image) {
        layers[imageName] = {
          image: image,
          width: image.naturalWidth,
          height: image.naturalHeight,
          speed: BACKGROUNDS[imageName],
          pos: 0,
        };
      });
    });
  });

  return sequence.then(function () {
    return layers;
  });
};

Background.prototype.update = function (velocity) {
  for (const key in this.layers) {
    const layer = this.layers[key];

    if (key === "near") {
      
    }

    layer.pos -= layer.speed * velocity;
    if (layer.pos <= -surface.width) {
      layer.pos = 0;
    }
  }
};

Background.prototype.render = function () {
  surface.fillTo(Background.id, this.skyColor);

  for (const key in this.layers) {
    const layer = this.layers[key];

    surface.drawTo(Background.id, layer.image, layer.pos, 0);
    if (layer.pos !== 0) {
      surface.drawTo(Background.id, layer.image, layer.pos + surface.width, 0);
    }
  }
};

Background.prototype.drawLayer = function (layer, shift) {
  surface.drawTo(Background.id, layer.image, layer.pos - shift);

  // surfaceLayer.ctx.drawImage(
  //   layer.image,
  //   layer.pos - shift,
  //   0,
  //   layer.width,
  //   layer.height,
  //   0,
  //   0,
  //   surface.width,
  //   surface.height
  // );
};
