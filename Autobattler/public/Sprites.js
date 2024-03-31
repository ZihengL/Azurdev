import { ANIM_ROWS_LAYOUT, CUSTOM_ANIMS } from "./custom-animations.js";

const RES = "./public/res/";
const SPRITESHEETS = RES + "LPC/spritesheets/";

const DEF_WIDTH = 832;
const DEF_HEIGHT = 1344;
const DEF_FRAMESIZE = 64;

// --------------------------------
//          IMAGE LOADING
// --------------------------------

function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  return [canvas, ctx];
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = SPRITESHEETS + src;
  });
}

export function loadImageCutout(ctx, src, startX, startY, cutWidth, cutHeight) {
  const image = new Image();
  image.src = src;
  image.onload = () => {
    ctx.drawImage(
      image,
      startX,
      startY,
      cutWidth,
      cutHeight,
      0,
      0,
      cutWidth,
      cutHeight
    );
  };

  return canvas.toDataURL();
}

export function getAnimationRow(image, definition, action) {}

// --------------------------------
//        CHARACTER PARSING
// --------------------------------

function getSheetDimensions(layers) {
  let width = DEF_WIDTH;
  let height = DEF_HEIGHT;
  let oversize_width = 0;
  let oversize_height = 0;

  layers.map((layer) => {
    const custom_animation = layer.custom_animation;

    if (custom_animation !== undefined) {
      const custom_definition = CUSTOM_ANIMS[custom_animation];
      const frame_size = custom_definition.frameSize;
      const frames_count = custom_definition.frames[0].length;

      oversize_width = Math.max(oversize_width, frame_size * frames_count);
      oversize_height += frame_size;
    }
  });

  return [width, height, oversize_width, oversize_height];
}

function extractRowIndexes(row) {
  const layout = row[0].split(",")[0];
  const indexes = row.map((frame) => {
    const frame_index = frame.charAt(frame.length - 1);

    // console.log("asdkhals", frame_index);
    return parseInt(frame_index);
  });

  return [layout, indexes];
}

export async function getSpriteData(file) {
  return await fetch(RES + file + ".json")
    .then((response) => response.json())
    .then((data) => {
      // data.layers = data.layers.sort((a, b) => a.zPos - b.zPos);
      return data;
    })
    .catch((error) => {
      console.error("Promise rejected:", error);
    });
}

export async function loadBase(sortedLayers) {
  const [canvas, ctx] = createCanvas(DEF_WIDTH, DEF_HEIGHT);

  await Promise.all(
    sortedLayers.map(async (layer) => {
      const image = await loadImage(layer.fileName);
      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
    })
  );

  return canvas.toDataURL();
}

// TODO: FIGURE OUT HOW TO PROPERLY CALCULATE SIZE OF EACH FRAME OF CUSTOM ANIMS
// WHY DO THEY REPEAT?
// HOW TO OVERLAY CHARACTER ONTO IT TOO?
// const sortedLayers = layers.sort((a, b) => a.zPos - b.zPos);
export async function loadPredefined(layers) {
  try {
    const [width, height, oversize_width, oversize_height] =
      getSheetDimensions(layers);
    const [canvas, ctx] = createCanvas(
      width + oversize_width,
      height + oversize_height
    );

    let customAnimations = [];

    await Promise.all(
      layers.map(async (layer) => {
        const image = await loadImage(layer.fileName);

        if (layer.custom_animation) {
          const custom_definition = CUSTOM_ANIMS[layer.custom_animation];
          const frame_size = custom_definition.frameSize;

  
          custom_definition.frames.map((row) => {


            const [layout, indexes] = extractRowIndexes(row);
            console.log("EXTRACTED", layout, indexes);

            row.map((frame, index) => {
              const [rowName, column] = frame.split(",");
              const row = ANIM_ROWS_LAYOUT[rowName] + 1;
              const sX = column * DEF_FRAMESIZE;
              const sY = row * DEF_FRAMESIZE;
              const wX = row.length * frame_size;

              ctx.drawImage(image, sX, height + sY, frame_size, frame_size);

              console.log(rowName, " - r:", row, "c:", column);
            });
          });
        } else {
          ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        }
      })
    );

    return canvas.toDataURL();
  } catch (error) {
    console.error("Error preloading and combining images:", error);
  }
}
