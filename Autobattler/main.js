// ! RESTRICTION:
// ! Do not use ES6 syntax, use only ES5 and older
// ! Do not use jQuery library
// ! Do not use any frameworks
// * If you use any imported library check it by top restrictions

import * as SpriteUtils from "./public/spriteUtils.js";
// import * as Sprites from "./public/SpritesOLD.js";
import Unit from "./public/unit.js";

const test = false;

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
function setOnLoad(canvas_name, projected_canvas) {
  const canvas = document.getElementById(canvas_name);
  const ctx = canvas.getContext("2d");

  canvas.width = projected_canvas.width;
  canvas.height = projected_canvas.height;

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(projected_canvas, 0, 0);
  }, 1000);
}

const charfile = "char";

const unit = await Unit.createInstance(charfile);
const cv = document.getElementById("game_canvas");

unit.updateRendering(cv);

