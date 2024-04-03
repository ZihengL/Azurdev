import CONFIG from "../config.js";
import * as SpriteUtils from "./sprite_utils.js";

export default class Unit {
  constructor(filename, canvasses, customOffsets) {
    this.filename = filename;
    this.canvasses = canvasses;
    this.customOffsets = customOffsets;
  }

  static async createInstance(filename) {
    const filedata = await SpriteUtils.getSpriteData(filename);
    const canvasses = await SpriteUtils.loadLayers(filedata.layers);

    // SpriteUtils.baseDimensions();
    // SpriteUtils.parseCustomLayer("thrust_oversize");

    return new Unit(filename, canvasses);
  }

  updateRendering(cv) {
    const ctx = cv.getContext("2d");

    cv.width = this.canvasses.both.width;
    cv.height = this.canvasses.both.height;
    console.log("CV", cv.width, cv.height);

    // ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(this.canvasses.both, 0, 0);
    // ctx.drawImage(this.canvasses.custom, 0, this.canvasses.base.height);
  }
}
