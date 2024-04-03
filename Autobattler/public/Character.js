import CONFIG from "../config.js";

const SPRITES = CONFIG.SPRITES;
const { PATH, WIDTH, HEIGHT, FRAMESIZE, CUSTOM } = SPRITES;

class Character {
  constructor(filename, canvasses) {
    this.filename = filename;
    this.canvasses = this.loadLayers();
  }

  static async createInstance(filename) {
    const filedata = await getSpriteData(filename);
  }
}
