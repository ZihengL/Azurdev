function centerX(size) {
  return (surface.cv.width - size) / 2;
}

function centerY(size) {
  return (surface.cv.height - size) / 2;
}

function center(width, height) {
  return {
    x: centerX(width),
    y: centerY(height),
  };
}

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
