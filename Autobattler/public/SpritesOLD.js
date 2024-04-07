import { ANIM_ROWS_LAYOUT, CUSTOM_ANIMS } from "./custom-animations.js";

const ASSETS = "./public/Assets/";
const SPRITESHEETS = ASSETS + "LPC/spritesheets/";

const DEF_WIDTH = 832;
const DEF_HEIGHT = 1344;
const DEF_FRAMESIZE = 64;

// ----------------------------------------------------------------
//                          IMAGE LOADING
// ----------------------------------------------------------------

function imgdata(cutout) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = cutout.width;
  canvas.height = cutout.height;

  ctx.putImageData(cutout, 0, 0);
  return canvas.toDataURL();
}

function createCanvas(width, height, frequent_reading = true) {
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

function adjustCanvasSize(canvas, image) {
  canvas.width = Math.max(canvas.width, image.naturalWidth);
  canvas.height += image.naturalHeight;

  return canvas;
}

function getAttackName(layer) {
  const split_path = layer.fileName.split("/");
  const attack_index = split_path.indexOf(layer.variant) + 1;

  return split_path[attack_index];
}

export async function getSpriteData(file) {
  return await fetch(ASSETS + file + ".json")
    .then((response) => response.json())
    .then((data) => {
      // data.layers = data.layers.sort((a, b) => a.zPos - b.zPos);
      return data;
    })
    .catch((error) => {
      console.error("Promise rejected:", error);
    });
}

function getCharPosition(layout, frame_index) {
  const x = frame_index * DEF_FRAMESIZE;
  const y = (ANIM_ROWS_LAYOUT[layout] + 1) * DEF_FRAMESIZE;

  return [x, y];
}

function getCustomPosition(layout, frame_index) {
  console.log(layout);
  const x = frame_index * 1;
}

export async function loadLayers(layers) {
  const [w, h, custom_w, custom_h] = getSheetDimensions(layers);
  const [base_canvas, base_ctx] = createCanvas(w, h);
  const [custom_canvas, custom_ctx] = createCanvas(custom_w, custom_h);
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

  ///////////////////////////////////////////////////////

  const custom_layers = layers.filter(
    (layer) => layer.custom_animation !== undefined
  );
  const [canvas, ctx] = createCanvas(custom_w, custom_h);
  offset_y = 0;

  await Promise.all(
    custom_layers.map(async (layer) => {
      const anim = layer.custom_animation;
      const definition = CUSTOM_ANIMS[layer.custom_animation];
      const framesize = definition.frameSize;
      offset_y = custom_anims[anim];

      definition.frames.map((row) => {
        console.log("framesize", framesize, "anim", anim, "ROW", row);
        const [layout, frame_indexes] = extractRowData(row);
        let offset_x = 0;

        frame_indexes.map((frame_index) => {
          const [char_x, char_y] = getCharPosition(layout, frame_index);
          const char_cutout = base_ctx.getImageData(
            char_x,
            char_y,
            DEF_FRAMESIZE,
            DEF_FRAMESIZE
          );
          const custom_cutout = custom_ctx.getImageData(
            offset_x,
            offset_y,
            framesize,
            framesize
          );

          const x = (custom_cutout.width - char_cutout.width) / 2;
          const y = (custom_cutout.height - char_cutout.height) / 2;

          ctx.putImageData(custom_cutout, offset_x, offset_y);
          ctx.putImageData(char_cutout, offset_x + x, offset_y + y);

          // console.log("cutout", imgdata(char_cutout), layer);
          console.log(
            "cutout cust",
            offset_x,
            offset_y,
            imgdata(custom_cutout),
            imgdata(char_cutout)
          );
          // console.log(offset_x + x, offset_y + y, canvas.toDataURL());

          offset_x += framesize;
          console.log(
            offset_x,
            offset_y,
            "custom height",
            custom_canvas.height
          );
        });

        offset_y += framesize;
      });
    })
  );

  return [base_canvas, custom_canvas, canvas];
}

export async function loadBase(layers) {
  const [canvas, ctx] = createCanvas(DEF_WIDTH, DEF_HEIGHT);
  ctx.globalCompositeOperation = "source-over";
  let custom_layers = { width: 0, height: 0, layers: {} };

  await Promise.all(
    layers.map(async (layer) => {
      const custom_animation = layer.custom_animation;

      if (!custom_animation) {
        const image = await loadImage(layer.fileName);
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
      } else {
        if (custom_layers.layers[custom_animation]) {
          custom_layers.layers[custom_animation].push(layer);
        } else {
          const { frameSize, frames } = CUSTOM_ANIMS[custom_animation];

          custom_layers.width = Math.max(
            frameSize * frames[0].length,
            custom_layers.width
          );
          custom_layers.height += frameSize * frames.length;
          custom_layers.layers[custom_animation] = [layer];
        }
      }
    })
  );

  return [canvas, custom_layers];
}

// NOTE: DON'T CHANGE CANVAS SIZE DYNAMICALLY WHILE DRAWING
export async function loadCustom(base_canvas, custom_layers) {
  const [canvas, ctx] = createCanvas(custom_layers.width, custom_layers.height);
  let offset_y = 0;

  for (const animation in custom_layers.layers) {
    let increment = 0;

    for (const layer of custom_layers.layers[animation]) {
      const image = await loadImage(layer.fileName);
      increment = image.naturalHeight;

      ctx.drawImage(
        image,
        0,
        offset_y,
        image.naturalWidth,
        image.naturalHeight
      );
    }

    offset_y += increment;
  }

  return canvas;
}

export async function loadAll(layers) {
  const [base_canvas, custom_layers] = await loadBase(layers);
  const custom_canvas = await loadCustom(base_canvas, custom_layers);

  const [canvas, ctx] = createCanvas(
    Math.max(base_canvas.width, custom_canvas.width),
    base_canvas.height + custom_canvas.height,
    true
  );

  ctx.drawImage(base_canvas, 0, 0);

  for (const animation in custom_layers.layers) {
    const [front, back] = custom_layers.layers[animation];
    let increment = 0;

    for (const layer of custom_layers.layers[animation]) {
      const image = await loadImage(layer.fileName);
      increment = image.naturalHeight;
    }
  }

  return canvas;
}

// ----------------------------------------------------------------
//                        ADV SHEET PARSING
// ----------------------------------------------------------------

function getSheetDimensions(layers) {
  let oversize_width = 0;
  let oversize_height = 0;
  let custom_animations = [];

  layers.map((layer) => {
    const custom_animation = layer.custom_animation;

    if (
      custom_animation &&
      custom_animations.indexOf(custom_animation) === -1
    ) {
      const definition = CUSTOM_ANIMS[custom_animation];
      const frame_size = definition.frameSize;
      const frames_count = definition.frames[0].length;
      const rows_count = definition.frames.length;

      oversize_width = Math.max(frame_size * frames_count, oversize_width);
      oversize_height += frame_size * rows_count;

      custom_animations.push(custom_animation);
    }
  });

  return [DEF_WIDTH, DEF_HEIGHT, oversize_width, oversize_height];
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

///////////////////////////////////////////////////

// TODO: DRAW BASIC SHEET FIRST AND SAVE CUSTOM ANIMS PARSED OUT IN ARRAY, THEN DRAW THE THINGS OUT
export async function loadCustom2(layers) {
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
        console.log("CUSTOM_LAYER", layer);

        if (layer.custom_animation) {
          const definition = CUSTOM_ANIMS[layer.custom_animation];
          const framesize = definition.frameSize;

          ctx.drawImage(
            image,
            0,
            DEF_HEIGHT,
            image.naturalWidth,
            image.naturalHeight
          );

          definition.frames.map((row) => {
            const [layout, frame_indexes] = extractRowData(row);
            let offset_x = 0;

            frame_indexes.map((frame_index) => {
              const [frame_x, frame_y] = getCharPosition(layout, frame_index);
              const frame_cutout = ctx.getImageData(
                frame_x,
                frame_y,
                DEF_FRAMESIZE,
                DEF_FRAMESIZE
              );

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
    // const [width, height, oversize_width, oversize_height] =
    //   getSheetDimensions(layers);
    const [canvas, ctx] = createCanvas(DEF_WIDTH, DEF_HEIGHT, true);
    let custom_animations = [];

    console.log("LAYERS", layers);

    await Promise.all(
      layers.map(async (layer) => {
        if (!layer.custom_animation) {
          const image = await loadImage(layer.fileName);

          ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        } else {
          custom_animations.push(layer);
        }
      })
    );

    return [canvas.toDataURL(), custom_animations];
  } catch (error) {
    console.error("Error preloading and combining images:", error);
  }
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