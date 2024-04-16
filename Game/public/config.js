const game_cv = document.getElementById("game_cv");
const game_ctx = game_cv.getContext("2d");
game_cv.width = window.innerWidth;
game_cv.height = window.innerHeight;

const surface = {
  cv: game_cv,
  ctx: game_ctx,
  width: game_cv.width,
  height: game_cv.height,
};

const BACKGROUNDS = {
  images: ["near", "middle", "far"],
  near: 0.5,
  middle: 0.2,
  far: 0,
};

const PLAYER = {
  stats: {
    health: 100,
    mana: 100,
  },
  fx: {
    color: "green",
    position: new Vector2D(200, surface.height - 800),
    size: new Vector2D(300, 800),
    bar_width: 10,
    bar_height: 30,
  },
};

const PROJECTILES = {
  fire_weak: {
    name: { en: "Weak Fireball", fr: "Boule de feu faible" },
    stats: {
      element: "fire",
      damage: 5,
      mana: 5,
    },
    fx: {
      color: "red",
      size: 15,
      speed: 1000,
    },
  },
};

const BOT = {
  fx: {
    color: "purple",
    position: new Vector2D(surface.width, surface.height - 800),
    size: new Vector2D(300, 800),
    speed: 5,
    max: surface.width - 500,
  },
};

const SHIELDS = {
  name: { en: "Weak Shield", fr: "Bouclier faible" },
  damage: 5,
};

const ENEMIES = {
  orc_weak: {
    name: { en: "Weak orc", fr: "l'Orc faible" },
    health: 50,
    projectiles: ["fire_weak"],
    fx: {
      color: "purple",
      position: new Vector2D(surface.width, surface.height - 800),
      size: new Vector2D(300, 800),
      speed: 5,
      max: surface.width - 500,
    },
  },
  orc_strong: {
    name: { en: "Strong orc", fr: "l'Orc fort" },
    health: 50,
    projectiles: ["fire_weak"],
    fx: {
      color: "purple",
      position: new Vector2D(surface.width, surface.height - 800),
      size: new Vector2D(300, 800),
      speed: 5,
      max: surface.width - 500,
    },
  },
};
