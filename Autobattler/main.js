// ! RESTRICTION:
// ! Do not use ES6 syntax, use only ES5 and older
// ! Do not use jQuery library
// ! Do not use any frameworks
// * If you use any imported library check it by top restrictions

import * as Sprites from "./public/Sprites.js";
import { ANIM_ROWS_LAYOUT, CUSTOM_ANIMS } from "./public/custom-animations.js";

// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;

const WIDTH = 832;
const HEIGHT = 1344;
const FRAMESIZE = 64;

let canvas = document.getElementById("game_canvas");
let ctx = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

let custom_canvas = document.getElementById("custom_canvas");
let custom_ctx = custom_canvas.getContext("2d");

custom_canvas.width = WIDTH;
custom_canvas.height = HEIGHT;

// let testcanvas = document.getElementById("test_canvas");
// let testctx = testcanvas.getContext("2d");

// testcanvas.width = WIDTH;
// testcanvas.height = HEIGHT;

const charfile = "char";

const chardata = await Sprites.getSpriteData(charfile);
console.log(chardata);

const combined = new Image();
combined.src = await Sprites.loadPredefined(chardata.layers);

const custom = new Image();
custom.src = await Sprites.loadCustom(chardata.layers);

// const testresult = new Image();
// testresult.src = combined.src;

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
setInterval(function () {
  canvas.width = combined.naturalWidth;
  canvas.height = combined.naturalHeight;
  custom_canvas.width = custom.naturalWidth;
  custom_canvas.height = custom.naturalHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(combined, 0, 0, combined.naturalWidth, combined.naturalHeight);

  custom_ctx.clearRect(0, 0, custom.width, custom.height);
  custom_ctx.drawImage(
    custom,
    0,
    0,
    custom.naturalWidth,
    custom.naturalHeight
  );

  // testctx.clearRect(0, 0, testcanvas.width, testcanvas.height);
  // testctx.drawImage(
  //   testresult,
  //   0,
  //   startY,
  //   testresult.naturalWidth,
  //   FRAMESIZE,
  //   0,
  //   0,
  //   testresult.naturalWidth,
  //   64
  // );
}, 1000);
