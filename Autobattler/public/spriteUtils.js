import CONFIG from '../config.js';

const { PATH, WIDTH, HEIGHT, LAYOUTS } = CONFIG.SPRITES;
const { DIRECTIONS, FRAMESIZE, ROWSCOUNT, BASE, CUSTOM } = LAYOUTS;

const BASE_KEYS = Object.keys(BASE);

// ----------------------------------------------------------------
//                            OFFSETS
// ----------------------------------------------------------------

export const layoutOffset = (layout) => {
  return BASE_KEYS.indexOf(layout) * ROWSCOUNT * FRAMESIZE;
}

export const rowOffset = (layout, direction) => {
  return layoutOffset(layout) + DIRECTIONS.indexOf(direction) * FRAMESIZE;
}

export const layoutWidth = (layout) => {
  return BASE[layout] * FRAMESIZE;
}

export const layoutHeight = (layout) => {
  return layout === 'death' ? FRAMESIZE : ROWSCOUNT * FRAMESIZE;
}

export const baseLayoutDimensions = (layout) => {
  return [layoutWidth(layout), layoutHeight(layout)];
}

export const customLayoutDimensions = (layout) => {
  const { framesize, framescount } = CUSTOM[layout];

  return [framesize * framescount, framesize * ROWSCOUNT];
}

// ----------------------------------------------------------------
//                            LOADING
// ----------------------------------------------------------------

export async function loadUnit(file) {
  const layers = await getSpriteLayers(file);
  const [surface, offsets, customLayers] = await loadBaseLayers(layers);
  const coordinates = Object.assign({}, BASE);

  for (const layer of customLayers) {
    const image = await loadImage(layer.fileName);
    const offset = offsets[layer.custom_animation];
    const definition = CUSTOM[layer.custom_animation];
    const { layout, framesize, framescount } = definition;
    
    if (layer.fileName.includes('behind')) {
      drawToFullSize(surface, image, 0, offset);
      blitCustomFrames(surface, offset, definition);
    } else {
      blitCustomFrames(surface, offset, definition);
      drawToFullSize(surface, image, 0, offset);
    }

    coordinates[layout] = { offset, framesize, framescount };
  }

  return [surface.cv, coordinates];
}

export async function loadBaseLayers(layers) {
  const surface = createSurface(WIDTH, HEIGHT);
  let oversizeWidth = WIDTH, oversizeHeight = HEIGHT;
  let offsets = {};
  let customLayers = [];

  for (const layer of layers) {
    const customLayout = layer.custom_animation;

    if (customLayout === undefined) {
      const image = await loadImage(layer.fileName);

      drawToFullSize(surface, image, 0, 0);
    } else {
      if (!offsets.hasOwnProperty(customLayout)) {
        const [width, height] = customLayoutDimensions(customLayout);

        offsets[customLayout] = oversizeHeight;
        oversizeWidth = Math.max(width, oversizeWidth);
        oversizeHeight += height;
      }

      customLayers.push(layer);
    }
  }
  resizeSurface(surface, oversizeWidth, oversizeHeight);

  return [surface, offsets, customLayers];
}

export function blitCustomFrames(surface, offset, definition) {
  const { layout, framesize, frames } = definition;
  const center = (framesize - FRAMESIZE) / 2;
  let fromY = BASE[layout].offset;
  let toY = offset + center;

  for (const columns of frames) {
    let toX = center;

    for (const column of columns) {
      const fromX = column * FRAMESIZE;

      blitCopyTo(surface, fromX, fromY, toX, toY, FRAMESIZE);
      toX += framesize;
    }

    fromY += FRAMESIZE;
    toY += framesize;
  }
}

// ----------------------------------------------------------------
//                             CREATING
// ----------------------------------------------------------------

// ----------------------------------------------------------------
//                              UTILS
// ----------------------------------------------------------------

function printImgData(img) {
  let width, height;

  if (img instanceof Image) {
    width = img.naturalWidth;
    height = img.naturalHeight;
  } else {
    width = img.width;
    height = img.height;
  }

  const surface = createSurface(width, height);
  surface.ctx.drawImage(img, 0, 0);
  
  console.log(surface.cv.toDataURL());
  return surface;
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

export async function getSpriteLayers(file) {
  const spriteData = await getSpriteData(file);

  return spriteData.layers;
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = PATH + src;
  });
}

export function createSurface(width = 0, height = 0, frequent_reading = true) {
  const cv = document.createElement("canvas");
  const ctx = cv.getContext("2d", {willReadFrequently: frequent_reading});
  cv.width = width;
  cv.height = height;

  return { cv, ctx };
}

export function resizeSurface(surface, width, height) {
  const image = new Image();

  image.onload = () => {
    surface.cv.width = width;
    surface.cv.height = height;
    surface.ctx.drawImage(image, 0, 0);
  };
  image.src = surface.cv.toDataURL();
}

export function drawToFullSize(surface, image, x, y) {
  surface.ctx.drawImage(image, x, y, image.naturalWidth, image.naturalHeight);
}

export function blitCopyTo(surface, fromX, fromY, toX, toY, size) {
  surface.ctx.drawImage(surface.cv, 
    fromX, fromY, size, size, 
    toX, toY, size, size);
}

// ----------------------------------------------------------------
//                              TESTS
// ----------------------------------------------------------------