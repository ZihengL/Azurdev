import CONFIG from '../config.js';

const SPRITES = CONFIG.SPRITES;
const { PATH, WIDTH, HEIGHT, FRAMESIZE, CUSTOM } = SPRITES;

// ----------------------------------------------------------------
//                        IMAGE LOADING UTILS
// ----------------------------------------------------------------

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

  return [
    canvas,
    canvas.getContext("2d", {
      willReadFrequently: frequent_reading,
      alpha: true,
    }),
  ];
}

export async function getSpriteData(filename) {
  return await fetch(CONFIG.ASSETS_PATH + file + ".json")
  .then((response) => response.json())
  .then((data) => {
    // data.layers = data.layers.sort((a, b) => a.zPos - b.zPos);
    return data;
  })
  .catch((error) => {
    console.error("Promise rejected:", error);
  });
}

export function getSheetDimensions(layers) {
  let oversizeWidth    = 0,
      oversizeHeight   = 0,
      customAnimations = [];

  layers.map((layer) => {
    const customAnimation = layer.custom_animation;

    if (
      customAnimation &&
      customAnimations.indexOf(customAnimation) === -1
    ) {
      const definition  = CUSTOM.ANIMATIONS[customAnimation],
            frameSize   = definition.frameSize,
            framesCount = definition.frames[0].length,
            rowsCount   = definition.frames.length;

      oversizeWidth = Math.max(frameSize * framesCount, oversizeWidth);
      oversizeHeight += frameSize * rowsCount;

      customAnimations.push(customAnimation);
    }
  });

  return [WIDTH, HEIGHT, oversizeWidth, oversizeHeight];
}

export async function loadLayers(layers) {
  const [width, height, customWidth, customHeight] = getSheetDimensions(layers);
  const [base_canvas, base_ctx] = createCanvas(width, height);
  const [custom_canvas, custom_ctx] = createCanvas(customWidth, customHeight);
  let custom_anims = {};
  let offset_y = 0;

  await Promise.all(
    layers.map(async (layer) => {
      const image = await loadImage(layer.fileName);
      const anim = layer.custom_animation;
      let ctx = base_ctx;
      let x = 0,
        y = 0;

      if (anim) {
        if (custom_anims[anim] === undefined) {
          custom_anims[anim] = offset_y;
          offset_y += image.naturalHeight;
        }

        y = custom_anims[anim];
        ctx = custom_ctx;
      }

      ctx.drawImage(image, x, y, image.naturalWidth, image.naturalHeight);
    })
  );

  return [base_canvas, custom_canvas];
}
