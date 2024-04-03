// ! RESTRICTION:
// ! Do not use ES6 syntax, use only ES5 and older
// ! Do not use jQuery library
// ! Do not use any frameworks
// * If you use any imported library check it by top restrictions

import * as SpriteUtils from "./public/sprite_utils.js";
import * as Sprites from "./public/SpritesOLD.js";
import Unit from "./public/unit.js";
import { ANIM_ROWS_LAYOUT, CUSTOM_ANIMS } from "./public/custom-animations.js";

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

if (test) {
  const chardata = await SpriteUtils.getSpriteData(charfile);
  console.log(chardata);

  //

  // let canvas = document.getElementById("game_canvas");
  // let ctx = canvas.getContext("2d");
  const [base, custom_layers] = await Sprites.loadBase(chardata.layers);
  setOnLoad("game_canvas", base);

  // let custom_canvas = document.getElementById("custom_canvas");
  // let custom_ctx = custom_canvas.getContext("2d");
  const custom = await Sprites.loadCustom(base, custom_layers);
  setOnLoad("custom_canvas", custom);

  const [base_both, custom_both, custom2] = await Sprites.loadLayers(
    chardata.layers
  );
  setOnLoad("custom2", custom2);

  const both_canvas = document.getElementById("both_canvas");
  const both_ctx = both_canvas.getContext("2d");

  both_canvas.width = Math.max(base_both.width, custom_both.width);
  both_canvas.height = base_both.height + custom_both.height;
  console.log("base both", base_both.height);

  setInterval(() => {
    both_ctx.clearRect(0, 0, both_canvas.width, both_canvas.height);
    both_ctx.drawImage(base_both, 0, 0);
    both_ctx.drawImage(custom_both, 0, base_both.height);
  }, 1000);

  // let combined_canvas = document.getElementById("test_canvas");
  // let combined_ctx = combined_canvas.getContext("2d");
  const combined = await Sprites.loadAll(chardata.layers);
  setOnLoad("test_canvas", combined);
  console.log("combined", combined);
} else {
  const unit = await Unit.createInstance(charfile).then((instance) => {
    return instance;
  });
  const cv = document.getElementById("game_canvas");

  unit.updateRendering(cv);
}
