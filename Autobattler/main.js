// ! RESTRICTION:
// ! Do not use ES6 syntax, use only ES5 and older
// ! Do not use jQuery library
// ! Do not use any frameworks
// * If you use any imported library check it by top restrictions

import * as Sprites from "./public/Sprites.js";

const WIDTH = 800;
const HEIGHT = 600;

let canvas = document.getElementById("game_canvas");
let ctx = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

const charfile = "char";

const image = new Image();
image.src = "ex1.png";

// setInterval(function () {
//   const targetWidth = 1000;

//   // Calculate the aspect ratio
//   const aspectRatio = image.naturalWidth / image.naturalHeight;

//   // Calculate the target height to maintain the aspect ratio
//   const targetHeight = targetWidth / aspectRatio;

//   // Draw the image at the desired location and size
//   ctx.drawImage(image, 100, 100, targetWidth, targetHeight);
// }, 1);

const chardata = await Sprites.getSpriteData(charfile);
console.log(chardata);

const combined = new Image()
combined.src = await Sprites.loadCharacter(chardata.layers);

setInterval(function () {
  const aspectRatio = combined.naturalWidth / combined.naturalHeight;
  const targetHeight = canvas.height / aspectRatio;

  ctx.drawImage(combined, 100, 100, WIDTH, targetHeight);
}, 1); 
