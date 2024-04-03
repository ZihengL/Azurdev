import CONFIG from '../config.js';

const SPRITES = CONFIG.SPRITES;
const { PATH, WIDTH, HEIGHT, FRAMESIZE, LAYOUTS } = SPRITES;
const { DIRECTIONS, ROWS_COUNT, SETS, CUSTOM } = LAYOUTS;

// ----------------------------------------------------------------
//                        IMAGE LOADING UTILS
// ----------------------------------------------------------------

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
          willReadFrequently: frequent_reading,
          alpha: true,
         }),
  };
}

export function parseCustomLayer(animation) {
  const definition = LAYOUTS.CUSTOM[animation];
  const width  = definition.framesize * definition.framescount;
  const height = definition.framesize * LAYOUTS.ROWS_COUNT;

  return [width, height];
}

export async function parseLayers(layers) {
  let width = 0;
  let height = 0;
  let currentOffset = HEIGHT;
  let offsets = {};

  let baseLayers = [];
  let customLayers = [];

  layers.forEach((layer) => {
      const animation = layer.custom_animation;

      if (animation !== undefined && !offsets.hasOwnProperty(animation)) {
        const [layerWidth, layerHeight] = parseCustomLayer(animation);

        width = Math.max(width, layerWidth);
        height += layerHeight;
        offsets[animation] = currentOffset;
        currentOffset += layerHeight;
        customLayers.push(layer);
      } else {
        baseLayers.push(layer);
      }
  });

  const base = await loadBase(baseLayers);
  const custom = createCanvas(width, height);

  return [base, custom, offsets];
  // return [width, height, offsets];
}

export async function loadBase(baseLayers) {
  const surface = createCanvas(WIDTH, HEIGHT);

  await Promise.all(
    baseLayers.map(async (layer) => {
      const image = await loadImage(layer.fileName);
      
      surface.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
    })
  );

  return surface;
}

export async function loadLayers(layers) {
  const [width, height, offsets] = await parseLayers(layers);
  const surface = createCanvas(width + WIDTH, height + HEIGHT);

  console.log("LAYERS", layers);
  await Promise.all(
    layers.map(async (layer) => {
      const image = await loadImage(layer.fileName);
      const offset = offsets[layer.custom_animation] ?? 0;

      surface.ctx.drawImage(image, 0, offset, image.naturalWidth, image.naturalHeight);
    })
  );

  return {

    offsets: offsets,
    both: surface.cv
  };
}

export async function loadLayers2(layers) {
  const [width, height, offsets] = parseLayers(layers);
  const custom = createCanvas(width, height);
  const base = createCanvas(WIDTH, HEIGHT);
  const both = createCanvas(width + WIDTH, height + HEIGHT);

  console.log("LAYERS", layers);
  await Promise.all(
    layers.map(async (layer) => {
      const image = await loadImage(layer.fileName);
      let ctx = base.ctx;
      let offset = 0;

      if (offsets.hasOwnProperty(layer.custom_animation)) {
          // if (customLayout[anim] === undefined) {
          //     customLayout[anim] = offsetY;
          //     offsetY += image.naturalHeight;
          // }

          ctx = custom.ctx;
          offset = offsets[layer.custom_animation] + HEIGHT;

          // if (layer.custom_animation === "thrust_oversize")
            console.log(layer);
      }

      ctx.drawImage(image, 0, offset, image.naturalWidth, image.naturalHeight);
      both.ctx.drawImage(image, 0, offset, image.naturalWidth, image.naturalHeight);
    })
  );

  return {
    base: base.cv, 
    custom: custom.cv, 
    offsets: offsets,
    both: both.cv
  };
}