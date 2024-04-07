import CONFIG from "../config.js";
import * as SpriteUtils from "./spriteUtils.js";
import SpriteHandler from "./spriteHandler.js";

export default class Unit {
  static units = { player: [], cpu: [] };

  constructor(file, spriteHandler) {
    this.file = file;
    this.spriteHandler = spriteHandler;
  }

  static async createInstance(file) {
    const spriteHandler = await SpriteHandler.createInstance(file);
    const unit = new Unit(file, spriteHandler);

    return unit;
  }

  updateRendering(cv) {
    this.spriteHandler.update(cv);
  }
}
