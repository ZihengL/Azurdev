var ROWS_LAYOUT = {
  "thrust-n": 3,
  "thrust-w": 4,
  "thrust-s": 5,
  "thrust-e": 6,
  "walk-n": 7,
  "walk-w": 8,
  "walk-s": 9,
  "walk-e": 10,
  "slash-n": 11,
  "slash-w": 12,
  "slash-s": 13,
  "slash-e": 14
};

var FRAMESIZE = 64;
var ROWSCOUNT = 4;
var DIRECTIONS = {
  n: [-135, -45],
  w: [45, -45],
  s: [45, 135],
  e: [-45, 45]
};
var BASE = {
  cast: {
    offset: 0,
    framesize: 64,
    framescount: 7
  }, 
  thrust: {
    offset: 256,
    framesize: 64,
    framescount: 8
  },
  walk: {
    offset: 512,
    framesize: 64,
    framescount: 9
  }, 
  slash: {
    offset: 768,
    framesize: 64,
    framescount: 6
  },
  string: {
    offset: 1024,
    framesize: 64,
    framescount: 13
  },
  death: {
    offset: 1280,
    framesize: 64,
    framescount: 6
  }, 
};
var CUSTOM = {
  tool_rod: {
    layout: "thrust",
    framesize: 128,
    framescount: 13,
    frames: [
      [0, 1, 2, 3, 4, 5, 4, 4, 4, 5, 4, 2, 3],
      [0, 1, 2, 3, 4, 5, 4, 4, 4, 5, 4, 2, 3],
      [0, 1, 2, 3, 4, 5, 4, 4, 4, 5, 4, 2, 3],
      [0, 1, 2, 3, 4, 5, 4, 4, 4, 5, 4, 2, 3]
    ]
  },
  slash_128: {
    layout: "slash",
    framesize: 128,
    framescount: 6,
    frames: [
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5]
    ]
  },
  thrust_oversize: {
    framesize: 192,
    layout: "thrust",
    framescount: 8,
    frames: [
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 7]
    ]
  },
  slash_oversize: {
    layout: "slash",
    framesize: 192,
    framescount: 6,
    frames: [
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5]
    ]
  },
  walk_128: {
    layout: "walk",
    framesize: 128,
    framescount: 8,
    frames: [
      [1, 2, 3, 4, 5, 6, 7, 8],
      [1, 2, 3, 4, 5, 6, 7, 8],
      [1, 2, 3, 4, 5, 6, 7, 8],
      [1, 2, 3, 4, 5, 6, 7, 8]
    ]
  },
  thrust_128: {
    layout: "thrust",
    framesize: 128,
    framescount: 8,
    frames: [
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 9]
    ]
  },
  slash_reverse_oversize: {
    layout: "slash",
    framesize: 192,
    framescount: 6,
    frames: [
      [5, 4, 3, 2, 1, 0],
      [5, 4, 3, 2, 1, 0],
      [5, 4, 3, 2, 1, 0],
      [5, 4, 3, 2, 1, 0]
    ]
  },
  whip_oversize: {
    layout: "slash",
    framesize: 192,
    framescount: 8,
    frames: [
      [0, 1, 4, 5, 3, 2, 2, 1],
      [0, 1, 5, 4, 3, 3, 3, 2],
      [0, 1, 5, 4, 3, 3, 2, 1],
      [0, 1, 5, 4, 3, 3, 3, 2]
    ]
  },
  tool_whip: {
    layout: "slash",
    framesize: 192,
    framescount: 8,
    frames: [
      [0, 1, 4, 5, 3, 2, 2, 1],
      [0, 1, 5, 4, 3, 3, 3, 2],
      [0, 1, 5, 4, 3, 3, 2, 1],
      [0, 1, 5, 4, 3, 3, 3, 2]
    ]
  }
}

var ASSETS_PATH = "./public/Assets/";
var PATH = "./public/Assets/LPC/spritesheets/";
var FPS = 30;
var WIDTH = 832;
var HEIGHT = 1344;
var ANIMATION_SPEED = 1000 / FPS;

var BASE_KEYS = Object.keys(BASE);
