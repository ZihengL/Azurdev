const ROWS_LAYOUT = {
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

// Subset of rows
// LHS: name - RHS: frames count
// order denotes positioning of set
// const BASE_LAYOUTS = {
//   cast: 7, 
//   thrust: 8,
//   walk: 9, 
//   slash: 6,
//   string: 13,
//   death: 6, 
// }

const BASE_LAYOUTS = {
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
}

// Frames index = direction
const CUSTOM_LAYOUTS = {
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

const CONFIG = {
    ASSETS_PATH: "./public/Assets/",
    SPRITES: {
        PATH: "./public/Assets/LPC/spritesheets/",
        FPS: 30,
        WIDTH: 832,
        HEIGHT: 1344,
        LAYOUTS: {
            DIRECTIONS: ["n", "w", "s", "e"],
            FRAMESIZE: 64,
            ROWSCOUNT: 4,
            BASE: BASE_LAYOUTS,
            CUSTOM: CUSTOM_LAYOUTS,
        }
    }
};

export default CONFIG;