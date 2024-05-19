// -------------- BASICS

const LOCALSTORAGE = {
  key: "Autobattler",
  defaults: {
    stats: {
      health: 5,
      mana: 20,
      mana_regen: 2.5,
    },
    gold: 100,
    level_progress: 0,
    skills: ["fire_weak", "ice_weak"],
    loadout: ["fire_weak", "ice_weak"],
  },
};

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
  Escape: "EXIT",
  p: "PAUSE",
  w: "A",
  a: "B",
  s: "C",
  d: "D",
  ArrowUp: "A",
  ArrowLeft: "B",
  ArrowDown: "C",
  ArrowRight: "D",
};

// -------------- MENUS

const SCREEN = {
  layers: ["backgrounds", "actors", "effects", "ui"],
  width: 1280,
  height: 720,
  fps: [15, 30, 60],
};

const SCREENS = {
  MAIN: "screen_main",
  MAP: "screen_map",
  GAME: "screen_game",
};

const DISPLAY = {
  screen_main: {
    btn_lang: ["FR", "EN"],
    btn_map: ["Map", "Carte"],
    btn_newgame: ["New game", "Nouveau profil"],
  },
  screen_map: {
    selected_level: ["Choose your adventure", "Choisissez votre aventure"],
    btn_play: ["Play", "Jouer"],
    btn_back: ["Back", "Retour"],
    // selected_level: ["Level", "Niveau"],
  },
  screen_game: {
    btn_quitLevel: ["Back", "Retour"],
  },
};

// const LANGS = ["en", "fr"];
const LANGS = [0, 1];

// -------------- BACKGROUNDS & UI

const BACKGROUNDS = {
  path: "./public/Assets/backgrounds/",
  layers: {
    far: {
      images: ["far.png"],
      multiplier: 0,
      grounded: false,
      position: { x: 0, y: 0 },
    },
    clouds: {
      images: ["clouds.png"],
      multiplier: 0.03,
      grounded: false,
      position: { x: 0, y: 0 },
    },
    middle: {
      images: ["middle.png"],
      multiplier: 0.05,
      grounded: true,
      position: { x: 0, y: 0 },
    },
    near: {
      images: ["near.png"],
      multiplier: 1,
      grounded: true,
      position: { x: 0, y: 0 },
    },
    ground: {
      images: ["ground.png"],
      multiplier: 1,
      grounded: true,
      position: { x: 0, y: 0 },
    },
  },
};

const UI = {
  actors: {
    player: {
      nameplate: {
        font: "48px serif",
        fillStyle: "blue",
        textAlign: "left",
        textBaseline: "middle",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowBlur: 4,
        shadowOffsetX: 20,
        shadowOffsetY: 5,
        start: { x: 0.05, y: 0.1 },
      },
      status_bars: {
        health: {
          color: "#A91D3A",
          missing: "#FCF5ED",
          start: { x: 0.05, y: 0.2 },
          end: { x: 0.4, y: 0.23 },
        },
        mana: {
          color: "#2C4E80",
          missing: "#C4E4FF",
          start: { x: 0.05, y: 0.24 },
          end: { x: 0.4, y: 0.245 },
        },
      },
    },
    opponent: {
      nameplate: {
        font: "48px serif",
        fillStyle: "red",
        textAlign: "right",
        textBaseline: "middle",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowBlur: 4,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        start: { x: 0.95, y: 0.1 },
      },
      status_bars: {
        health: {
          color: "#A91D3A",
          missing: "#C4E4FF",
          start: { x: 0.6, y: 0.2 },
          end: { x: 0.95, y: 0.23 },
        },
        cooldown: {
          color: "#FCF5ED",
          missing: "#00224D",
          start: { x: 0.6, y: 0.24 },
          end: { x: 0.95, y: 0.245 },
        },
      },
    },
  },
  skills: {},
  status: {
    win: {
      value: ["VICTORY", "VICTOIRE"],
      delay: 0,
      font: "82px serif",
      fontSize: 0.26,
      fillStyle: "green",
      textAlign: "center",
      textBaseline: "middle",
      start: { x: 0.5, y: 0.5 },
    },
    lose: {
      value: ["DEFEAT", "DÉFAITE"],
      delay: 1,
      font: "82px serif",
      fillStyle: "red",
      textAlign: "center",
      textBaseline: "middle",
      start: { x: 0.5, y: 0.5 },
    },
    pause: {
      value: ["PAUSED", "PAUSE"],
      delay: 1,
      font: "82px serif",
      fillStyle: "red",
      textAlign: "center",
      textBaseline: "middle",
      start: { x: 0.5, y: 0.5 },
    },
  },
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

// -------------- SKILLS & EFFECTS

const AFFINITIES = {
  fire: {
    name: ["fire", "feux"],
    weakness: "ice",
    color: "red",
    effect: {
      cast: "./public/Assets/effects/fire.png",
      width: 340,
      height: 340,
    },
  },
  ice: {
    name: ["ice", "glace"],
    weakness: "fire",
    color: "blue",
    effect: {
      cast: "./public/Assets/effects/fire.png",
      width: 340,
      height: 340,
    },
  },
  poison: {
    name: ["poison", "poison"],
    weakness: "shock",
    color: "green",
    effect: {
      cast: "./public/Assets/effects/fire.png",
      width: 340,
      height: 340,
    },
  },
  shock: {
    name: ["shock", "électrique"],
    weakness: "poison",
    color: "blue",
    effect: {
      cast: "./public/Assets/effects/fire.png",
      width: 340,
      height: 340,
    },
  },
};

const SKILL_LEVELS = {
  weak: {
    name: { en: "weak", fr: "faible" },
    damage: 1,
    protection: 1,
    mana: 5,
    cost: 50,
  },
  medium: {
    name: { en: "medium", fr: "moyen" },
    damage: 3,
    protection: 3,
    mana: 15,
    cost: 100,
  },
  strong: {
    name: { en: "strong", fr: "puissant" },
    damage: 6,
    protection: 6,
    mana: 30,
    cost: 200,
  },
};

const EFFECTS = {
  cast_timer: 2,
  cast_effect: {
    delay: 2,
    opacity: 0.1,
    scale: 0.2,
    angle: 0.01,
  },
};

const SKILLS = {
  fire_weak: {
    name: ["Weak Fireball", "Boule de feu faible"],
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
    name: ["Weak Icicle", "Boule de glace faible"],
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

// -------------- ACTORS

const SPRITES = {
  velocity: 10,
  animation_speed: 0.25,
};

const STATES = { RUN: "run", IDLE: "idle", DEATH: "death", CAST: "cast" };

const PLAYER = {
  name: ["Player", "Joueur"],
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
      rows: { run: 5, idle: 6, death: 4, cast: 3 },
    },
    position: {
      velocity: 2,
      start: {
        x: -0.5,
        y: 0.75,
      },
      combat: {
        x: 0.2,
        y: 0.75,
      },
      end: {
        x: 1.5,
        y: 0.75,
      },
    },
    bar_width: 5,
    bar_height: 20,
  },
};

const OPPONENTS = {
  orc_weak: {
    name: ["orc", "orc"],
    strength: 0,
    stats: {
      strength: 1,
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
        rows: { run: 5, idle: 6, death: 4, cast: 3 },
      },
      position: {
        velocity: 5,
        start: {
          x: 1.5,
          y: 0.75,
        },
        combat: {
          x: 0.8,
          y: 0.75,
        },
        end: {
          x: -0.5,
          y: 0.75,
        },
      },
    },
  },
  orc_strong: {
    // name: { en: "orc", fr: "orc" },
    name: ["orc", "orc"],
    strength: 2,
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
        rows: { run: 5, idle: 6, death: 4, cast: 3 },
      },
      position: {
        velocity: 5,
        start: {
          x: 1.5,
          y: 0.75,
        },
        combat: {
          x: 0.8,
          y: 0.75,
        },
        end: {
          x: -0.5,
          y: 0.75,
        },
      },
    },
  },
};

const OPPONENT_NAMES = {
  // strength: {
  //   en: ["weak", "medium", "strong"],
  //   fr: ["faible", "moyen", "puissant"],
  // },
  // adjective: {
  //   en: ["Vile", "Ugly", "Stinky"],
  //   fr: ["Dégoutant", "Laide", "Nocif"],
  // },
  // prefix: {
  //   en: "of",
  //   fr: "de",
  // },
  strength: [
    ["weak", "medium", "strong"],
    ["faible", "moyen", "puissant"],
  ],
  adjective: [
    ["Vile", "Ugly", "Stinky"],
    ["Dégoutant", "Laide", "Nocif"],
  ],
  prefix: ["of", "de"],
};

// -------------- LEVELS

const LEVELS = [
  {
    types: ["orc_weak", "orc_strong"],
    count: 5,
    mob_cd: 2,
  },
  {
    types: ["orc_strong"],
    count: 2,
    mob_cd: 2,
  },
];
