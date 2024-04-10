// ----------------------------------------------------------------
//                            OFFSETS
// ----------------------------------------------------------------

function layoutOffset(layout) {
  return BASE_KEYS.indexOf(layout) * ROWSCOUNT * FRAMESIZE;
}

function rowOffset(layout, direction) {
  return layoutOffset(layout) + DIRECTIONS.indexOf(direction) * FRAMESIZE;
}

function layoutWidth(layout) {
  return BASE[layout] * FRAMESIZE;
}

function layoutHeight(layout) {
  return layout === "death" ? FRAMESIZE : ROWSCOUNT * FRAMESIZE;
}

function baseLayoutDimensions(layout) {
  return [layoutWidth(layout), layoutHeight(layout)];
}

function customLayoutDimensions(layout) {
  var { framesize, framescount } = CUSTOM[layout];

  return { w: framesize * framescount, h: framesize * ROWSCOUNT };
}

// ----------------------------------------------------------------
//                            LOADING
// ----------------------------------------------------------------

function loadUnit(file) {
  return getSpriteLayers(file).then(function (layers) {
    return loadBaseLayers(layers).then(function (result) {
      var surface = result.surface;
      var customOffsets = result.customOffsets;
      var customLayers = result.customLayers;

      return processLayers(customLayers, surface, customOffsets).then(function (
        coordinates
      ) {
        return { cv: surface.cv, coordinates: coordinates };
      });
    });
  });
}

function processLayer(layer, surface, customOffsets, coordinates) {
  return loadImage(layer.fileName).then(function (image) {
    var def = CUSTOM[layer.custom_animation];

    var offset = customOffsets[layer.custom_animation];
    var layout = def.layout;
    var framesize = def.framesize;
    var frames = def.frames;
    var framescount = def.framescount;

    if (layer.fileName.indexOf("behind") > -1) {
      drawToFullSize(surface, image, 0, offset);
      blitCustomFrames(surface, offset, layout, framesize, frames);
    } else {
      blitCustomFrames(surface, offset, layout, framesize, frames);
      drawToFullSize(surface, image, 0, offset);
    }

    coordinates[layout] = {
      offset: offset,
      framesize: framesize,
      framescount: framescount,
    };
  });
}

function processLayers(customLayers, surface, customOffsets) {
  var coordinates = Object.assign({}, BASE);
  var sequence = Promise.resolve();

  customLayers.forEach(function (layer) {
    sequence = sequence.then(function () {
      return processLayer(layer, surface, customOffsets, coordinates);
    });
  });

  return sequence.then(function () {
    return coordinates;
  });
}

function loadBaseLayers(layers) {
  var surface = createSurface(WIDTH, HEIGHT);
  var oversizeWidth = WIDTH;
  var oversizeHeight = HEIGHT;
  var customOffsets = {};
  var customLayers = [];
  var promises = [];

  layers.forEach(function (layer) {
    var layout = layer.custom_animation;

    if (layout === undefined) {
      promises.push(
        loadImage(layer.fileName).then(function (image) {
          drawToFullSize(surface, image, 0, 0);
        })
      );
    } else {
      if (!customOffsets.hasOwnProperty(layout)) {
        var def = CUSTOM[layout];
        var width = def.framesize * def.framescount;
        var height = def.framesize * ROWSCOUNT;

        customOffsets[layout] = oversizeHeight;
        oversizeWidth = Math.max(width, oversizeWidth);
        oversizeHeight += height;
      }

      customLayers.push(layer);
    }
  });

  return Promise.all(promises).then(function () {
    resizeSurface(surface, oversizeWidth, oversizeHeight);
    return { surface, customOffsets, customLayers };
  });
}

function blitCustomFrames(surface, offset, layout, framesize, frames) {
  var center = (framesize - FRAMESIZE) / 2;
  var fromY = BASE[layout].offset;
  var toY = offset + center;

  frames.forEach(function (columns) {
    var toX = center;

    columns.forEach(function (column) {
      var fromX = column * FRAMESIZE;

      blitCopyTo(surface, fromX, fromY, toX, toY, FRAMESIZE);
      toX += framesize;
    });

    fromY += FRAMESIZE;
    toY += framesize;
  });
}

// ----------------------------------------------------------------
//                              UTILS
// ----------------------------------------------------------------

function getSpriteData(filename) {
  return fetch(ASSETS_PATH + filename + ".json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // data.layers = data.layers.sort((a, b) => a.zPos - b.zPos);
      return data;
    })
    .catch(function (error) {
      console.error("Promise rejected:", error);
    });
}

function getSpriteLayers(file) {
  return getSpriteData(file).then(function (spriteData) {
    return spriteData.layers;
  });
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
    image.src = PATH + src;
  });
}

function createSurface(width, height, frequent_reading) {
  width = width || 0;
  height = height || 0;
  frequent_reading = frequent_reading || true;

  var cv = document.createElement("canvas");
  var ctx = cv.getContext("2d", { willReadFrequently: frequent_reading });
  cv.width = width;
  cv.height = height;

  return { cv: cv, ctx: ctx };
}

function resizeSurface(surface, width, height) {
  var image = new Image();

  image.onload = function () {
    surface.cv.width = width;
    surface.cv.height = height;
    surface.ctx.drawImage(image, 0, 0);
  };
  image.src = surface.cv.toDataURL();
}

function drawToFullSize(surface, image, x, y) {
  surface.ctx.drawImage(image, x, y, image.naturalWidth, image.naturalHeight);
}

function blitCopyTo(surface, fromX, fromY, toX, toY, size) {
  surface.ctx.drawImage(
    surface.cv,
    fromX,
    fromY,
    size,
    size,
    toX,
    toY,
    size,
    size
  );
}

// ----------------------------------------------------------------

// async function loadUnit(file) {
//   var layers = await getSpriteLayers(file);
//   var [surface, customOffsets, customLayers] = await loadBaseLayers(layers);
//   var coordinates = Object.assign({}, BASE);

//   for (var layer of customLayers) {
//     var image = await loadImage(layer.fileName);
//     var offset = customOffsets[layer.custom_animation];
//     var definition = CUSTOM[layer.custom_animation];
//     var { layout, framesize, framescount } = definition;

//     if (layer.fileName.includes('behind')) {
//       drawToFullSize(surface, image, 0, offset);
//       blitCustomFrames(surface, offset, definition);
//     } else {
//       blitCustomFrames(surface, offset, definition);
//       drawToFullSize(surface, image, 0, offset);
//     }

//     coordinates[layout] = { offset, framesize, framescount };
//   }

//   return { cv: surface.cv, coordinates };
// }

// async function loadBaseLayers(layers) {
//   var surface = createSurface(WIDTH, HEIGHT);
//   var oversizeWidth = WIDTH, oversizeHeight = HEIGHT;
//   var customOffsets = {};
//   var customLayers = [];

//   for (var layer of layers) {
//     var customLayout = layer.custom_animation;

//     if (customLayout === undefined) {
//       var image = await loadImage(layer.fileName);

//       drawToFullSize(surface, image, 0, 0);
//     } else {
//       if (!customOffsets.hasOwnProperty(customLayout)) {
//         var [customWidth, customHeight] = customLayoutDimensions(customLayout);

//         customOffsets[customLayout] = oversizeHeight;
//         oversizeWidth = Math.max(customWidth, oversizeWidth);
//         oversizeHeight += customHeight;
//       }

//       customLayers.push(layer);
//     }
//   }
//   resizeSurface(surface, oversizeWidth, oversizeHeight);

//   return [surface, customOffsets, customLayers];
// }

// function blitCustomFrames(surface, offset, definition) {
//   var { layout, framesize, frames } = definition;
//   var center = (framesize - FRAMESIZE) / 2;

//   var fromY = BASE[layout].offset;
//   var toY = offset + center;

//   frames.forEach(function(columns) {
//     var toX = center;

//     // for (var column of columns) {
//     columns.forEach(function(column) {
//       var fromX = column * FRAMESIZE;

//       blitCopyTo(surface, fromX, fromY, toX, toY, FRAMESIZE);
//       toX += framesize;
//     });

//     fromY += FRAMESIZE;
//     toY += framesize;
//   });
// }

// function printImgData(img) {
//   var width, height;

//   if (img instanceof Image) {
//     width = img.naturalWidth;
//     height = img.naturalHeight;
//   } else {
//     width = img.width;
//     height = img.height;
//   }

//   var surface = createSurface(width, height);
//   surface.ctx.drawImage(img, 0, 0);

//   console.log(surface.cv.toDataURL());
//   return surface;
// }

// async function getSpriteData(filename) {
//   return await fetch(CONFIG.ASSETS_PATH + filename + ".json")
//   .then((response) => response.json())
//   .then((data) => {
//     // data.layers = data.layers.sort((a, b) => a.zPos - b.zPos);
//     return data;
//   })
//   .catch((error) => {
//     console.error("Promise rejected:", error);
//   });
// }

// async function getSpriteLayers(file) {
//   var spriteData = await getSpriteData(file);

//   return spriteData.layers;
// }

// function loadImage(src) {
//   return new Promise((resolve, reject) => {
//     var img = new Image();
//     img.onload = () => resolve(img);
//     img.onerror = reject;
//     img.src = PATH + src;
//   });
// }

// function createSurface(width = 0, height = 0, frequent_reading = true) {
//   var cv = document.createElement("canvas");
//   var ctx = cv.getContext("2d", {willReadFrequently: frequent_reading});
//   cv.width = width;
//   cv.height = height;

//   return { cv, ctx };
// }

// function resizeSurface(surface, width, height) {
//   var image = new Image();

//   image.onload = () => {
//     surface.cv.width = width;
//     surface.cv.height = height;
//     surface.ctx.drawImage(image, 0, 0);
//   };
//   image.src = surface.cv.toDataURL();
// }

// function drawToFullSize(surface, image, x, y) {
//   surface.ctx.drawImage(image, x, y, image.naturalWidth, image.naturalHeight);
// }

// function blitCopyTo(surface, fromX, fromY, toX, toY, size) {
//   surface.ctx.drawImage(surface.cv,
//     fromX, fromY, size, size,
//     toX, toY, size, size);
// }
