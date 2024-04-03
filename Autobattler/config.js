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
const SETS = {
  cast: 7, 
  thrust: 8, 
  walk: 9, 
  slash: 6,
  string: 13,
  death: 6, 
}


// Frames index = direction
const CUSTOM = {
  tool_rod: {
    framesize: 128,
    layout: "thrust",
    framescount: 13,
    frames: [
      [0, 1, 2, 3, 4, 5, 4, 4, 4, 5, 4, 2, 3],
      [0, 1, 2, 3, 4, 5, 4, 4, 4, 5, 4, 2, 3],
      [0, 1, 2, 3, 4, 5, 4, 4, 4, 5, 4, 2, 3],
      [0, 1, 2, 3, 4, 5, 4, 4, 4, 5, 4, 2, 3]
    ]
  },
  slash_128: {
    framesize: 128,
    layout: "slash",
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
    framesize: 192,
    layout: "slash",
    framescount: 6,
    frames: [
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5]
    ]
  },
  walk_128: {
    framesize: 128,
    layout: "walk",
    framescount: 8,
    frames: [
      [1, 2, 3, 4, 5, 6, 7, 8],
      [1, 2, 3, 4, 5, 6, 7, 8],
      [1, 2, 3, 4, 5, 6, 7, 8],
      [1, 2, 3, 4, 5, 6, 7, 8]
    ]
  },
  thrust_128: {
    framesize: 128,
    layout: "thrust",
    framescount: 8,
    frames: [
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 9]
    ]
  },
  slash_reverse_oversize: {
    framesize: 192,
    layout: "slash",
    framescount: 6,
    frames: [
      [5, 4, 3, 2, 1, 0],
      [5, 4, 3, 2, 1, 0],
      [5, 4, 3, 2, 1, 0],
      [5, 4, 3, 2, 1, 0]
    ]
  },
  whip_oversize: {
    framesize: 192,
    layout: "slash",
    framescount: 8,
    frames: [
      [0, 1, 4, 5, 3, 2, 2, 1],
      [0, 1, 5, 4, 3, 3, 3, 2],
      [0, 1, 5, 4, 3, 3, 2, 1],
      [0, 1, 5, 4, 3, 3, 3, 2]
    ]
  },
  tool_whip: {
    framesize: 192,
    layout: "slash",
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
        WIDTH: 832,
        HEIGHT: 1344,
        FRAMESIZE: 64,
        LAYOUTS: {
            DIRECTIONS: ["n", "w", "s", "e"],
            ROWS_COUNT: 4,
            SETS: SETS,
            CUSTOM: CUSTOM,
        }
    }
};

export default CONFIG;