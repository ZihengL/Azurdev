import CONFIG from "../config.js";
import * as SpriteUtils from "./sprite_utils.js";

export default class Unit {
  constructor(filename, canvas, offsets) {
    this.filename = filename;
    this.canvas = canvas;
    this.offsets = offsets;
  }

  static async createInstance(filename) {
    const filedata = await SpriteUtils.getSpriteData(filename);
    const [canvas, offsets] = await SpriteUtils.loadLayers(filedata.layers);

    console.log("UNIT CV", canvas);

    // SpriteUtils.baseDimensions();
    // SpriteUtils.parseCustomLayer("thrust_oversize");

    return new Unit(filename, canvas, offsets);
  }

  updateRendering(cv) {
    const ctx = cv.getContext("2d");
    cv.width = this.canvas.width;
    cv.height = this.canvas.height;
    // console.log("CV", cv.width, cv.height);

    // ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(this.canvas, 0, 0);
    // ctx.drawImage(this.canvasses.custom, 0, this.canvasses.base.height);
  }
}
