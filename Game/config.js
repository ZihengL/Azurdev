// -------------- BASICS

const LOCALSTORAGE = {
  key: "Autobattler",
  defaults: {
    stats: {
      health: 3,
      damage: 1,
      potions: 1,

      mana: 20,
      mana_regen_sec: 0.5,
    },
    gold: 100,
    level_progress: 0,
    skills: ["fire_weak", "ice_weak"],
    loadout: ["fire_weak", "ice_weak"],
  },
};

const KEYMAPS = {
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

const SEQUENCE = ["A", "B", "C", "D"];

// -------------- MENUS

const LANGS = [0, 1];

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
  buttons: {
    screen_main: {
      btn_lang: ["FR", "EN"],
      btn_map: ["Map", "Carte"],
      btn_newgame: ["New game", "Nouveau profil"],
    },
    screen_map: {
      selected_level: ["Choose your adventure", "Choisissez votre aventure"],
      btn_play: ["Play", "Jouer"],
      btn_back: ["Back", "Retour"],
    },
    screen_game: {
      btn_quitLevel: ["Back", "Retour"],
      btn_pauseLevel: ["Pause", "Pause"],
    },
  },
  other: {
    game_status: {
      status_paused: ["PAUSED", "PAUSE"],
      status_victory: ["VICTORY", "VICTOIRE"],
      status_defeat: ["DEFEAT", "DÉFAITE"],
    },
    delays: {
      end_delay: 10,
    },
  },
};

// -------------- BACKGROUNDS & UI

const BACKGROUNDS = {
  path: "./public/Assets/backgrounds/",
  themes: {
    forest: [
      {
        image: "forest-0.png",
        multiplier: 0.03,
        grounded: true,
        position: { x: 0, y: 0 },
      },
      {
        image: "forest-1.png",
        multiplier: 0,
        grounded: false,
        position: { x: 0, y: 0 },
      },
      {
        image: "forest-2.png",
        multiplier: 0.05,
        grounded: true,
        position: { x: 0, y: 0 },
      },
      {
        image: "forest-3.png",
        multiplier: 1,
        grounded: true,
        position: { x: 0, y: 0 },
      },
    ],
    mountains: [
      {
        image: "mountains-0.png",
        multiplier: 0,
        grounded: false,
        position: { x: 0, y: 0 },
      },
      {
        image: "mountains-1.png",
        multiplier: 0.03,
        grounded: true,
        position: { x: 0, y: 0 },
      },
      {
        image: "mountains-2.png",
        multiplier: 0.05,
        grounded: true,
        position: { x: 0, y: 0 },
      },
      {
        image: "mountains-3.png",
        multiplier: 0.1,
        grounded: true,
        position: { x: 0, y: 0 },
      },
      {
        image: "mountains-4.png",
        multiplier: 1,
        grounded: true,
        position: { x: 0, y: 0 },
      },
    ],
    industrial: [
      {
        image: "industrial-0.png",
        multiplier: 0,
        grounded: true,
        position: { x: 0, y: 0 },
      },
      {
        image: "industrial-1.png",
        multiplier: 0.05,
        grounded: true,
        position: { x: 0, y: 0 },
      },
      {
        image: "industrial-2.png",
        multiplier: 0.1,
        grounded: true,
        position: { x: 0, y: 0 },
      },
      {
        image: "industrial-3.png",
        multiplier: 1,
        grounded: true,
        position: { x: 0, y: 0 },
      },
    ],
    space: [
      {
        image: "space-0.png",
        multiplier: 0,
        grounded: false,
        position: { x: 0, y: 0 },
      },
      {
        image: "space-1.png",
        multiplier: 0.003,
        grounded: false,
        position: { x: 0, y: 0 },
      },
      {
        image: "space-2.png",
        multiplier: 0.05,
        grounded: false,
        position: { x: 0, y: 0 },
      },
      {
        image: "space-3.png",
        multiplier: 0.1,
        grounded: false,
        position: { x: 0, y: 0 },
      },
      {
        image: "space-4.png",
        multiplier: 1,
        grounded: false,
        position: { x: 0, y: 0 },
      },
    ],
  },
  // layers: {
  //   far: {
  //     images: ["far.png"],
  //     multiplier: 0,
  //     grounded: false,
  //     position: { x: 0, y: 0 },
  //   },
  //   clouds: {
  //     images: ["clouds.png"],
  //     multiplier: 0.03,
  //     grounded: false,
  //     position: { x: 0, y: 0 },
  //   },
  //   middle: {
  //     images: ["middle.png"],
  //     multiplier: 0.05,
  //     grounded: true,
  //     position: { x: 0, y: 0 },
  //   },
  //   near: {
  //     images: ["near.png"],
  //     multiplier: 1,
  //     grounded: true,
  //     position: { x: 0, y: 0 },
  //   },
  //   ground: {
  //     images: ["ground.png"],
  //     multiplier: 1,
  //     grounded: true,
  //     position: { x: 0, y: 0 },
  //   },
  // },
};

// -------------- SKILLS & EFFECTS

const AFFINITIES = {
  fire: {
    name: ["fire", "feux"],
    weakness: "ice",
    color: "red",
    cast_effect: "cast_fire",
    // effect: {
    //   cast: "./public/Assets/effects/fire.png",
    //   width: 340,
    //   height: 340,
    // },
  },
  ice: {
    name: ["ice", "glace"],
    weakness: "fire",
    color: "blue",
    cast_effect: "cast_ice",
  },
  poison: {
    name: ["poison", "poison"],
    weakness: "shock",
    color: "green",
    cast_effect: "cast_poison",
  },
  shock: {
    name: ["shock", "électrique"],
    weakness: "poison",
    color: "blue",
    cast_effect: "cast_shock",
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
  velocity: 2.5,
  animation_speed: 0.25,
};

const STATES = { RUN: "run", IDLE: "idle", DEATH: "death", CAST: "cast" };

const PLAYER = {
  name: ["Player", "Joueur"],
  stats: {
    health: 5,
    mana: 20,
    mana_regen_sec: 0.5,
  },
  fx: {
    layer: "actors",
    spritesheet: "./public/Assets/player/player.png",
    transition_property: "height",
    containers: {
      health_container: "p_health_container",
      health_text: "p_health_text",
      health_overlay: "p_health_fill_overlay",
      health: "p_health_fill",
      mana_container: "p_mana_container",
      mana_text: "p_mana_text",
      mana_overlay: "p_mana_fill_overlay",
      mana: "p_mana_fill",
    },
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
        x: 3,
        y: 0.75,
      },
    },
    bar_width: 5,
    bar_height: 20,
  },
};

const OPPONENT = {
  stats: {
    strength: { min: 0, max: 2 },
    cooldown: { min: 6, max: 2 },
    health: { min: 2, max: 10 },
    gold: { min: 10, max: 40 },
  },
  fx: {
    transition_property: "width",
    containers: {
      ui: "o_ui",
      name: "o_name",
      health_container: "o_health_container",
      health_overlay: "o_health_fill_overlay",
      health: "o_health_fill",
      cooldown_container: "o_cooldown_container",
      cooldown: "o_cooldown_fill",
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

const OPPONENTS2 = {
  stats: {},
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
    opponents: {
      types: ["orc_weak", "orc_strong"],
      count: 5,
    },
    sequence: {
      length: 3,
      time: 5,
    },
  },
  {
    opponents: {
      types: ["orc_strong"],
      count: 8,
    },
    sequence: {
      length: 5,
      time: 4,
    },
  },
];
