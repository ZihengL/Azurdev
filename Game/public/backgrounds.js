function loadImage(src) {
  return new Promise(function (resolve, reject) {
    var image = new Image();

    image.onload = function () {
      resolve(image);
    };
    image.onerror = function () {
      reject(new Error("Failed to load image"));
    };
    image.src = src;
  });
}

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
