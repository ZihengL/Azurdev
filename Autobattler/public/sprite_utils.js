import CONFIG from '../config.js';

const SPRITES = CONFIG.SPRITES;
const { PATH, WIDTH, HEIGHT, FRAMESIZE, LAYOUTS } = SPRITES;
const { DIRECTIONS, ROWS_COUNT, BASE_LAYOUTS, CUSTOM_LAYOUTS } = LAYOUTS;

// ----------------------------------------------------------------
//                        IMAGE LOADING UTILS
// ----------------------------------------------------------------

function imgdata(cutout, isImage = false) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  if (isImage) {

  } else {
  canvas.width = cutout.width;
  canvas.height = cutout.height;
  ctx.putImageData(cutout, 0, 0);
  }

  return canvas.toDataURL();
}

export async function getSpriteData(filename) {
  return await fetch(CONFIG.ASSETS_PATH + filename + ".json")
  .then((response) => response.json())
  .then((data) => {
    // data.layers = data.layers.sort((a, b) => a.zPos - b.zPos);
    return data;
  })
  .catch((error) => {
    console.error("Promise rejected:", error);
  });
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = PATH + src;
  });
}

export function createCanvas(width, height, frequent_reading = true) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  return {
    cv:  canvas,
    ctx: canvas.getContext("2d", {
          willReadFrequently: frequent_reading
         }),
  };
}

export async function loadAll(layers) {
  const base = createCanvas(WIDTH, HEIGHT);
  let width = 0;
  let height = 0;
  let offsets = {};
  let customLayers = [];

  await Promise.all(
    layers.map(async (layer) => {
      const customLayout = layer.custom_animation;

      if (customLayout === undefined) {
        const image = await loadImage(layer.fileName);
        base.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
      } else {
        if (!offsets.hasOwnProperty(customLayout)) {
          const [layerWidth, layerHeight] = parseCustomLayout(customLayout);

          offsets[customLayout] = HEIGHT + height;
          width = Math.max(width, layerWidth);
          height += layerHeight;
        }

        // layer.offset = offsets[layout];
        customLayers.push(layer);
      }
    })
  );

  return [base, width, height, customLayers, offsets];
}

export function prepLayers(layers) {
  return layers.reduce(
    (acc, layer) => {
      const customLayout = layer.custom_animation;

      if (layer.custom_animation === undefined) {
        acc.baseLayers.push(layer);
      } else {
        if (!acc.offsets.hasOwnProperty(customLayout)) {
          const [layerWidth, layerHeight] = parseCustomLayout(customLayout);

          acc.offsets[customLayout] = layerHeight + acc.height;
          acc.width = Math.max(layerWidth, acc.width);
          acc.height += layerHeight;
        }

        layer.offset = acc.offsets[customLayout];
        acc.customLayers.push(layer);
      }
  });
}

export function parseCustomLayout(animation) {
  const definition = CUSTOM_LAYOUTS[animation];
  const width  = definition.framesize * definition.framescount;
  const height = definition.framesize * ROWS_COUNT;

  return [width, height];
}

export async function parseBaseLayers(layers) {
  const base = createCanvas(WIDTH, HEIGHT);
  let width = 0;
  let height = 0;
  let offsets = {};
  let customLayers = [];

  await Promise.all(
    layers.map(async (layer) => {
      const customLayout = layer.custom_animation;

      if (customLayout === undefined) {
        const image = await loadImage(layer.fileName);
        base.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
      } else {
        if (!offsets.hasOwnProperty(customLayout)) {
          const [layerWidth, layerHeight] = parseCustomLayout(customLayout);

          offsets[customLayout] = HEIGHT + height;
          width = Math.max(width, layerWidth);
          height += layerHeight;
        }

        // layer.offset = offsets[customLayout];
        customLayers.push(layer);
      }
    })
  );

  return [base, width, height, customLayers];
}

export async function loadLayers(layers) {
  const [base, width, height, customLayers] = await parseBaseLayers(layers);
  const combined = createCanvas(
    Math.max(WIDTH, width), 
    HEIGHT + height
  );
  let offsets = {};

  await Promise.all(
    customLayers.map(async (layer) => {
      const image = await loadImage(layer.fileName);
      const transposed = transposeToCustom(base.ctx, CUSTOM_LAYOUTS[layer.custom_animation]);
      const y = offsets[layer.custom_animation];

      combined.ctx.drawImage(transposed.cv, 0, y, transposed.cv.width, transposed.cv.height);
      combined.ctx.drawImage(image, 0, y, image.naturalWidth, image.naturalHeight);
    })
  );
  combined.ctx.drawImage(base.cv, 0, 0);

  return [combined.cv, offsets];
}

export function getBaseLayoutOffset(layout) {
  return Object.keys(BASE_LAYOUTS).indexOf(layout) * ROWS_COUNT * FRAMESIZE;
}

export function transposeToCustom(ctx, customLayout) {
  const { layout, framesize, framescount, frames } = customLayout;
  const surface = createCanvas(framesize * framescount, framesize * frames.length);
  const offsetY = Object.keys(BASE_LAYOUTS).indexOf(layout) * ROWS_COUNT * FRAMESIZE;
  const frameCenter = (framesize - FRAMESIZE) / 2;

  let dY = frameCenter;
  frames.map((columns, row) => {
    const sY = row * FRAMESIZE + offsetY;
    let dX = frameCenter;

    columns.map((column) => {
      const sX = column * FRAMESIZE;
      const cutout = ctx.getImageData(sX, sY, FRAMESIZE, FRAMESIZE);

      // console.log(imgdata(cutout))
      surface.ctx.putImageData(cutout, dX, dY);
      dX += framesize;
    });

    dY += framesize;
  });

  // console.log(surface.cv.toDataURL());

  return surface;
}


// export async function loadLayers(layers) {
//   const [base, width, height, customLayers, offsets] = await parseBaseLayers(layers);
//   const combined = createCanvas(
//     Math.max(WIDTH, width), 
//     HEIGHT + height
//   );
//   let offset = HEIGHT;
//   // combined.ctx.globalCompositeOperation = 'source-over';
//   await Promise.all(
//     customLayers.map(async (layer) => {
//       const customLayout = CUSTOM_LAYOUTS[layer.custom_animation];
//       const {layout, framesize, frames} = CUSTOM_LAYOUTS[layer.custom_animation];
//       const baseOffset = getBaseLayoutOffset(customLayout.layout);
//       const isBehind = layer.fileName.includes('behind');
//       const image = await loadImage(layer.fileName);
//       const transposed = transposeToCustom(base.ctx, CUSTOM_LAYOUTS[layer.custom_animation]);

//       const compositeType = isBehind ? 'source-over' : 'source-over';


//       let front = transposed.cv;
//       let back = image;
//       if (isBehind) {
//       //   combined.ctx.drawImage(image, 0, offset, image.naturalWidth, image.naturalHeight);
//       //   combined.ctx.drawImage(transposed.cv, 0, offset, transposed.cv.width, transposed.cv.height);
//         front = image;
//         back = transposed.cv;
//       } else {
//       //   console.log(layer);
//       //   combined.ctx.drawImage(transposed.cv, 0, offset, transposed.cv.width, transposed.cv.height);
//       //   combined.ctx.drawImage(image, 0, offset, image.naturalWidth, image.naturalHeight);
//       }


//       // console.log(isBehind, compositeType, msg, layer.fileName)
//       // console.log(transposed.cv.toDataURL());

//       // const imageCV = createCanvas(image.naturalWidth, image.naturalHeight);
//       // imageCV.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
//       // if (!isBehind)
//       // console.log(imageCV.cv.toDataURL());

//       combined.ctx.drawImage(transposed.cv, 0, layer.offset, transposed.cv.width, transposed.cv.height);
//       combined.ctx.drawImage(image, 0, layer.offset, image.naturalWidth, image.naturalHeight);
//       // combined.ctx.save();
//       // combined.ctx.globalCompositeOperation = compositeType;

//       // combined.ctx.restore();
//       offset += isBehind ? transposed.cv.height : 0;
//     })
//   );
//   combined.ctx.drawImage(base.cv, 0, 0);

//   console.log(combined.cv.toDataURL())

//   return [combined.cv, offsets];
// }