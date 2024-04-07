import CONFIG from "../config.js";
import * as SpriteUtils from "./spriteUtils.js";

const ANIMATION_SPEED = 1000 / CONFIG.SPRITES.FPS;

export default class SpriteHandler {
  static debug = false;
  static loaded = {};

  constructor(canvas, coordinates) {
    this.canvas = canvas;
    this.coordinates = coordinates;

    this.currentAnimation = this.coordinates.walk;
    this.currentFrame = 0;
    this.lastUpdateTime = 0;
  }

  static async createInstance(file) {

    const filedata = await SpriteUtils.getSpriteData(file);
    console.log(filedata);
    const [canvas, coordinates] = await SpriteUtils.loadUnit(file);
    const handler = new SpriteHandler(canvas, coordinates);

    return handler;
  }

  static isLoaded(filename) {
    return SpriteHandler.loaded.hasOwnProperty(filename);
  }

  update(cv) {
    const ctx = cv.getContext("2d");
    cv.width = this.canvas.width;
    cv.height = this.canvas.height;
    // console.log("CV", cv.width, cv.height);

    // ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(this.canvas, 0, 0);
  }
}
