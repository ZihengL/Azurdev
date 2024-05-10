function Surface() {
  this.width = SCREEN.width;
  this.height = SCREEN.height;
  // this.visibility = 'hidden';

  this.layers = {};
  SCREEN.layers.forEach(
    function (canvas) {
      const cv = document.getElementById(canvas);
      const ctx = cv.getContext("2d");

      cv.width = this.width;
      cv.height = this.height;
      this.layers[canvas] = {
        cv: cv,
        ctx: ctx,
      };
    }.bind(this)
  );

  this.res = {};
}
const surface = new Surface();

Surface.prototype.resetRes = function () {
  this.res = {};
};

Surface.prototype.addToRes = function (key, image) {
  this.res[key] = image;
};

Surface.load = function () {
  return;
};

Surface.prototype.clear = function () {
  for (key in this.layers) {
    const layer = this.layers[key];

    layer.ctx.clearRect(0, 0, this.width, this.height);
  }
};

// -------------- SIZING, PROPORTIONS, ETC..

Surface.prototype.centerX = function (width) {
  return (this.width - width) / 2;
};

Surface.prototype.centerY = function (height) {
  return (this.height - height) / 2;
};

Surface.prototype.center = function () {
  return new Vector2D(this.centerX(), this.centerY());
};

Surface.prototype.ratioProportionX = function (ratio) {
  return this.width * ratio;
};

Surface.prototype.ratioProportionY = function (ratio) {
  return this.height * ratio;
};

Surface.prototype.ratioSizing = function (ratios) {
  const scale = ratios.scale || 1;

  return new Vector2D(ratios.width * scale, ratios.height * scale);
};

Surface.prototype.ratioPosition = function (ratios) {
  return new Vector2D(
    this.ratioProportionX(ratios.x),
    this.ratioProportionY(ratios.y)
  );
};

Surface.prototype.fillTo = function (layerName, color, x, y, width, height) {
  const layer = this.layers[layerName];
  x = x || 0;
  y = y || 0;
  width = width || this.width;
  height = height || this.height;

  layer.ctx.fillStyle = color;
  layer.ctx.fillRect(x, y, width, height);
};

Surface.prototype.fillVectorTo = function (id, color, pos, size) {
  this.fillTo(id, color, pos.x, pos.y, size.x, size.y);
};

Surface.prototype.drawTo = function (id, image, x, y, scale, width, height) {
  const layer = this.layers[id];
  scale = scale || 1;
  width = width || this.width;
  height = height || this.height;

  layer.ctx.drawImage(image, x, y, width * scale, height * scale);
};

Surface.prototype.drawActor = function (image, sPos, dPos, size, bleed) {
  const layer = this.layers.actors;
  bleed = bleed || 0;

  layer.ctx.drawImage(
    image,
    sPos.x,
    sPos.y,
    size.x,
    size.y,
    dPos.x - size.x / 2,
    dPos.y - size.y + bleed,
    size.x,
    size.y
  );
};

Surface.prototype.drawEffect = function (image, x, y, scale) {
  const layer = this.layers.effects;
  scale = scale || 1;

  layer.ctx.drawImage(
    image,
    x,
    y,
    image.naturalWidth * scale,
    image.naturalHeight * scale
  );
};

Surface.prototype.drawUI = function (image, x, y, scale) {
  const layer = this.layers.ui;
  scale = scale || 1;

  layer.ctx.drawImage(
    image,
    x,
    y,
    image.naturalWidth * scale,
    image.naturalHeight * scale
  );
};

Surface.prototype.toggleVisibility = function () {
  const toVisible = this.visibility === 'hidden';

  this.setVisibility(toVisible);
}

Surface.prototype.setVisibility = function (toVisible) {
  this.visibility = toVisible ? 'visible' : 'hidden';

  for (key in this.layers) {
    layer = this.layers[key];

    layer.cv.style.visibility = this.visibility;
  }
}
