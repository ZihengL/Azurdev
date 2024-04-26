const game_cv = document.getElementById("game_cv");
const game_ctx = game_cv.getContext("2d");
game_cv.width = window.innerWidth;
game_cv.height = window.innerHeight;

const surface = {
  cv: game_cv,
  ctx: game_ctx,
  width: game_cv.width,
  height: game_cv.height,
  center_x: game_cv.width / 2,
  center_y: game_cv.height / 2,
};

const BACKGROUNDS = {
  images: ["far", "middle", "near"],
  increment: 3,
  near: 20,
  middle: 6,
  far: 0,
};

const UI = {
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

const PLAYER = {
  stats: {
    health: 100,
    mana: 100,
  },
  fx: {
    images: "",
    color: "green",
    position: new Vector2D(200, surface.height - 800),
    size: new Vector2D(300, 800),
    bar_width: 10,
    bar_height: 30,
  },
};

const KEYMAPS = {
  PC: {
    casting: {
      w: "A",
      a: "B",
      s: "C",
      d: "D",
    },
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
  earth: {
    weakness: "air",
    color: "brown",
  },
  air: {
    weakness: "earth",
    color: "beige",
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
      mana: 5,
    },
    fx: {
      color: "red",
      size: 15,
      speed: 1000,
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
      mana: 5,
    },
    fx: {
      color: "blue",
      size: 15,
      speed: 1000,
    },
  },
};

const SHIELDS = {
  shield_weak: {
    name: { en: "Weak Shield", fr: "Bouclier faible" },
    stats: {},
    fx: {},
  },
};

const MOBS = {
  orc_weak: {
    name: { en: "Weak orc", fr: "l'Orc faible" },
    stats: {
      affinity: "fire",
      weight: 3,
      health: 1,
      cooldown: 3,
      attack: "fire_weak",
    },
    fx: {
      images: "",
      color: "orange",
      position: new Vector2D(surface.width, surface.height - 800),
      size: new Vector2D(300, 800),
      speed: 5,
      max: surface.width - 500,
    },
  },
  orc_strong: {
    name: { en: "Strong orc", fr: "l'Orc fort" },
    stats: {
      affinity: "ice",
      weight: 1,
      health: 3,
      cooldown: 2,
      attack: "ice_weak",
    },
    fx: {
      images: "",
      color: "blue",
      position: new Vector2D(surface.width, surface.height - 800),
      size: new Vector2D(300, 800),
      speed: 5,
      max: surface.width - 500,
    },
  },
};
