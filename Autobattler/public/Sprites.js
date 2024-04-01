import { ANIM_ROWS_LAYOUT, CUSTOM_ANIMS } from "./custom-animations.js";

const RES = "./public/res/";
const SPRITESHEETS = RES + "LPC/spritesheets/";

const DEF_WIDTH = 832;
const DEF_HEIGHT = 1344;
const DEF_FRAMESIZE = 64;

// ----------------------------------------------------------------
//                          IMAGE LOADING
// ----------------------------------------------------------------

function createCanvas(width, height, frequent_reading = true) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: frequent_reading });
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

// ----------------------------------------------------------------
//                       BASIC SHEET PARSING
// ----------------------------------------------------------------

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

// ----------------------------------------------------------------
//                        ADV SHEET PARSING
// ----------------------------------------------------------------

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

function extractRowData(row) {
  const layout = row[0].split(",")[0];
  const indexes = row.map((frame) => {
    const frame_index = frame.charAt(frame.length - 1);
    return parseInt(frame_index);
  });

  return [layout, indexes];
}

function getCutout(ctx, offset_x, offset_y, frame_size) {
  return ctx.getImageData(offset_x, offset_y, frame_size, frame_size);
}

function getRowCutout(ctx, layout, frame_indexes) {
  const row_offset_y = (ANIM_ROWS_LAYOUT[layout] + 1) * DEF_FRAMESIZE;
  const row_width = DEF_FRAMESIZE * frame_indexes.length;

  return ctx.getImageData(0, row_offset_y, row_width, DEF_FRAMESIZE);
}

function getLayeredRowCutouts(ctx, layout, frame_indexes) {
  const offset_y = (ANIM_ROWS_LAYOUT[layout] + 1) * DEF_FRAMESIZE;
  // const centered_y = offset_y + DEF_FRAMESIZE
  let offset_x = 0;

  let layered_cutouts = [];
  frame_indexes.map((frame_index, index) => {
    const frame_cutout = getCutout(ctx, row_cutout, offset_x);
    layered_cutouts.push();
    offset_x += DEF_WIDTH;
  });
}

function getFramePosition(layout, frame_index) {
  const x = frame_index * DEF_FRAMESIZE;
  const y = (ANIM_ROWS_LAYOUT[layout] + 1) * DEF_FRAMESIZE;

  return [x, y];
}

// TODO: DRAW BASIC SHEET FIRST AND SAVE CUSTOM ANIMS PARSED OUT IN ARRAY, THEN DRAW THE THINGS OUT
export async function loadCustom(layers) {
  try {
    const [width, height, oversize_width, oversize_height] =
      getSheetDimensions(layers);
    const [canvas, ctx] = createCanvas(
      width + oversize_width,
      height + oversize_height,
      true
    );
    let offset_y = DEF_HEIGHT;

    await Promise.all(
      layers.map(async (layer) => {
        const image = await loadImage(layer.fileName);
        console.log(layer.fileName)

        if (layer.custom_animation) {
          const definition = CUSTOM_ANIMS[layer.custom_animation];
          const framesize = definition.frameSize;

          ctx.drawImage(image, 0, DEF_HEIGHT, image.naturalWidth, image.naturalHeight);


          definition.frames.map((row) => {
            const [layout, frame_indexes] = extractRowData(row);
            let offset_x = 0;

            frame_indexes.map((frame_index) => {
              const [frame_x, frame_y] = getFramePosition(layout, frame_index);
              const frame_cutout = ctx.getImageData(frame_x, frame_y,
                DEF_FRAMESIZE, DEF_FRAMESIZE);

              const frame_center = DEF_FRAMESIZE / 2;
              const new_center = framesize / 2 - frame_center;
              
              const center_x = offset_x + framesize / 2;
              const center_y = offset_y + framesize / 2;

              ctx.putImageData(frame_cutout, frame_x, DEF_HEIGHT + frame_y);
              console.log("offsets", offset_x, DEF_HEIGHT + frame_y);
              offset_x += DEF_FRAMESIZE;
            });

            offset_y += framesize;

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

// TODO: FIGURE OUT HOW TO PROPERLY CALCULATE SIZE OF EACH FRAME OF CUSTOM ANIMS
// WHY DO THEY REPEAT?
// HOW TO OVERLAY CHARACTER ONTO IT TOO?
// const sortedLayers = layers.sort((a, b) => a.zPos - b.zPos);
export async function loadPredefined(layers) {
  try {
    const [width, height, oversize_width, oversize_height] =
      getSheetDimensions(layers);
    const [canvas, ctx] = createCanvas(width, height, true);

    console.log("LAYERS", layers);

    await Promise.all(
      layers.map(async (layer) => {
        const image = await loadImage(layer.fileName);

        if (!layer.custom_animation)
          ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
      })
    );

    return canvas.toDataURL();
  } catch (error) {
    console.error("Error preloading and combining images:", error);
  }
}
