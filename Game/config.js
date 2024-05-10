// const game_cv = document.getElementById("game_cv");
// const game_ctx = game_cv.getContext("2d");
// // game_cv.width = window.innerWidth;
// // game_cv.height = window.innerHeight;
// game_cv.width = 1280;
// game_cv.height = 720;

// const surface = {
//   cv: game_cv,
//   ctx: game_ctx,
//   width: game_cv.width,
//   height: game_cv.height,
//   center_x: game_cv.width / 2,
//   center_y: game_cv.height / 2,
// };

const KEYMAPS = {
  PC: {
    casting: {
      w: "A",
      a: "B",
      s: "C",
      d: "D",
      ArrowUp: "A",
      ArrowLeft: "B",
      ArrowDown: "C",
      ArrowRight: "D",
    },
  },
};

const SCREEN = {
  layers: ["backgrounds", "actors", "effects", "ui"],
  width: 1280,
  height: 720,
};

const BACKGROUNDS = {
  images: ["far", "middle", "near"],
  increment: 2,
  near: 0.1,
  middle: 0.05,
  far: 0,
};

const UI = {
  player: {
    health: {
      x: 0.2,
      y: 0.4,
      width: 0.3,
      height: 0.1,
      orientation: 1,
    },
    mana: {
      x: 0.4,
      y: 0.5,
      width: 0.3,
      height: 0.1,
    },
  },
  mob: {
    x: 0.9,
    y: 0.8,
    bar_height: 0.01,
    health: -50,
    healthColor: "red",
    cooldown: -30,
    cooldownColor: "gray",
  },
  win: {},
  lose: {},
  killcount: {
    x: 100,
    y: 100,
    value: "Score: ",
    font: "24px Arial",
    fillStyle: "black",
    textAlign: "center",
    textBaseline: "middle",
  },
};

const AFFINITIES = {
  fire: {
    weakness: "ice",
    color: "red",
  },
  ice: {
    weakness: "fire",
    color: "blue",
  },
  poison: {
    weakness: "shock",
    color: "green",
  },
  shock: {
    weakness: "poison",
    color: "blue",
  },
};

const SKILL_LEVELS = {
  weak: {
    name: { en: "weak", fr: "faible" },
    damage: 1,
    protection: 1,
    mana: 5,
  },
  medium: {
    name: { en: "medium", fr: "moyen" },
    damage: 3,
    protection: 3,
    mana: 15,
  },
  strong: {
    name: { en: "strong", fr: "puissant" },
    damage: 6,
    protection: 6,
    mana: 30,
  },
};

const SKILLS = {
  fire_weak: {
    name: { en: "Weak Fireball", fr: "Boule de feu faible" },
    stats: {
      sequence: ["B", "B", "D"],
      affinity: "fire",
      cooldown: 1,
      speed: 1000,
      damage: 1,
      mana_cost: 5,
    },
    fx: {
      color: "red",
      size: 15,
      speed: 1000,
      range: 5,
    },
  },
  ice_weak: {
    name: { en: "Weak Icicle", fr: "Boule de feu faible" },
    stats: {
      sequence: ["A", "A", "C"],
      affinity: "ice",
      cooldown: 1,
      speed: 1000,
      damage: 1,
      mana_cost: 5,
    },
    fx: {
      color: "blue",
      size: 15,
      speed: 1000,
      range: 5,
    },
  },
};

const SHIELDS = {
  fire_shield_weak: {
    name: { en: "Weak fire Shield", fr: "Bouclier de feu faible" },
    stats: {
      affinity: "fire",
      health: 1,
    },
    fx: {},
  },
};

// ACTORS

const SPRITES = {
  velocity: 10,
  animation_speed: 0.25,
};

const STATES = { RUN: "run", CAST: "cast", DEATH: "death", IDLE: "idle" };

const PLAYER = {
  stats: {
    health: 5,
    mana: 20,
    mana_regen: 2.5,
  },
  fx: {
    layer: "actors",
    spritesheet: "./public/Assets/player/player.png",
    sprites: {
      scale: 1,
      frame: {
        width: 120,
        height: 190,
        bleed: 20,
      },
      rows: { run: 5, cast: 6, death: 4, idle: 3 },
    },
    position: {
      velocity: 2,
      start: {
        x: -0.5,
        y: 1,
      },
      combat: {
        x: 0.2,
        y: 1,
      },
      end: {
        x: 1.5,
        y: 1,
      },
    },
    bar_width: 5,
    bar_height: 20,
  },
};

const MOBS = {
  orc_weak: {
    name: { en: "Weak orc", fr: "Orc faible" },
    stats: {
      affinity: "fire",
      skills: ["fire_weak", "ice_weak"],
      cooldown: 3,
      health: 3,
      weight: 3,
      gold: 5,
    },
    fx: {
      layer: "actors",
      spritesheet: "./public/Assets/player/player.png",
      sprites: {
        scale: 1,
        frame: {
          width: 120,
          height: 190,
          bleed: 20,
        },
        rows: { run: 5, cast: 6, death: 4, idle: 3 },
      },
      position: {
        velocity: 5,
        start: {
          x: 1.5,
          y: 1,
        },
        combat: {
          x: 0.8,
          y: 1,
        },
        end: {
          x: -0.5,
          y: 1,
        },
      },
    },
  },
  orc_strong: {
    name: { en: "Strong orc", fr: "Orc fort" },
    stats: {
      affinity: "fire",
      skills: ["fire_weak", "ice_weak"],
      cooldown: 3,
      health: 3,
      weight: 3,
      gold: 25,
    },
    fx: {
      layer: "actors",
      spritesheet: "./public/Assets/player/player.png",
      sprites: {
        scale: 1,
        frame: {
          width: 120,
          height: 190,
          bleed: 20,
        },
        rows: { run: 5, cast: 6, death: 4, idle: 3 },
      },
      position: {
        velocity: 5,
        start: {
          x: 1.5,
          y: 1,
        },
        combat: {
          x: 0.8,
          y: 1,
        },
        end: {
          x: -0.5,
          y: 1,
        },
      },
    },
  },
};
