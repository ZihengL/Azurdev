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

let testcanvas = document.getElementById("test_canvas");
let testctx = testcanvas.getContext("2d");

testcanvas.width = WIDTH;
testcanvas.height = HEIGHT;

const charfile = "char";

const chardata = await Sprites.getSpriteData(charfile);
console.log(chardata);

const combined = new Image();
combined.src = await Sprites.loadPredefined(chardata.layers);

const testresult = new Image();
testresult.src = combined.src;

const thrust_anim = CUSTOM_ANIMS["thrust_oversize"];
const custom_frames = thrust_anim.frames.map((frame) => {
  const split = frame.map(elem => elem.split(','));

  // console.log(split);
});

const thrustNorth = thrust_anim.frames[0];
const firstFrame = thrustNorth[0].split(",");
// console.log(thrust_anim, thrustNorth, firstFrame);

const frameLocation = ANIM_ROWS_LAYOUT[firstFrame[0]] + 1;
const startY = FRAMESIZE * frameLocation;
// console.log("frameLocation, sY", frameLocation, startY);


// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
setInterval(function () {
  canvas.width = combined.naturalWidth;
  canvas.height = combined.naturalHeight;
  // console.log("cv",
  //   canvas.width,
  //   canvas.height, "combined",
  //   combined.naturalWidth,
  //   combined.naturalHeight
  // );

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(combined, 0, 0, combined.naturalWidth, combined.naturalHeight);

  testctx.clearRect(0, 0, testcanvas.width, testcanvas.height);
  testctx.drawImage(
    testresult,
    0,
    startY,
    testresult.naturalWidth,
    FRAMESIZE,
    0,
    0,
    testresult.naturalWidth,
    64
  );
}, 1000);
