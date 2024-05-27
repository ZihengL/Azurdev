// -------------- BASICS

const LOCALSTORAGE = {
  key: "Combomage",
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
    skills: ["fire_weak", "ice_weak", "poison_weak", ""],
  },
};

const LOCALSTORAGE_OLD = {
  key: "Combomage",
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

  // NEW
  1: ["ArrowUp", "w"],
  2: ["ArrowLeft", "a"],
  3: ["ArrowDown", "s"],
  4: ["ArrowRight", "d"],
  EXIT: ["Escape", 461, 1001, 1009, 9],
  PAUSE: ["p", 8],
};

// const SEQUENCE = ["A", "B", "C", "D"];

// -------------- MENUS

const LANGS = [1, 2];

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
  elements: {
    screen_main: {
      menu_title: { 1: "COMBO-MAGE", 2: "MÉMO-MAGE" },
      btn_lang: { 1: "FR", 2: "EN" },
      btn_map: { 1: "Continue", 2: "Continuer" },
      btn_newgame: { 1: "New game", 2: "Nouveau Jeu" },
    },
    screen_map: {
      selected_level: {
        1: "Choose your adventure",
        2: "Choisissez votre aventure",
      },
      btn_play: { 1: "Play", 2: "Jouer" },
      btn_back: { 1: "Back", 2: "Retour" },
    },
    screen_game: {
      btn_quitLevel: { 1: "Back", 2: "Retour" },
      btn_pauseLevel: { 1: "Pause", 2: "Pause" },
      status_paused: { 1: "PAUSED", 2: "PAUSE" },
      status_victory: { 1: "VICTORY", 2: "VICTOIRE" },
      status_defeat: { 1: "DEFEAT", 2: "DÉFAITE" },
    },
  },
  other: {
    game_status: ["status_paused", "status_victory", "status_defeat"],

    delays: {
      end_delay: 5,
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
};

// -------------- SKILLS & EFFECTS

const AFFINITIES = {
  fire: {
    name: { 1: "fire", 2: "feux" },
    skill_name: { 1: "Fireball", 2: "Flamme Arcanique" },
    weakness: "ice",
    color: "red",
    cast_effect: "cast_fire",
  },
  ice: {
    name: { 1: "ice", 2: "glace" },
    skill_name: { 1: "Hailstorm", 2: "Tempête Verglaçante" },
    weakness: "fire",
    color: "blue",
    cast_effect: "cast_ice",
  },
  poison: {
    name: { 1: "poison", 2: "poison" },
    skill_name: { 1: "Venom Spray", 2: "Pluie Venimeuse" },
    weakness: "shock",
    color: "green",
    cast_effect: "cast_poison",
  },
  shock: {
    name: { 1: "shock", 2: "électrique" },
    skill_name: { 1: "Electro Surge", 2: "Surge Électrique" },
    weakness: "poison",
    color: "blue",
    cast_effect: "cast_shock",
  },
};

const SKILL_LEVELS = {
  weak: {
    name: { 1: "Dilute", 2: "Vacillant" },
    length: 4,
    sequences: {
      fire: 1134,
      ice: 2232,
      poison: 3321,
      shock: 4422,
    },
    damage: 1,
    mana: 5,
    cost: 50,
  },
  medium: {
    name: { 1: "Middling", 2: "Tempéré" },
    length: 6,
    sequences: {
      fire: 131422,
      ice: 232433,
      poison: 324211,
      shock: 442144,
    },
    damage: 3,
    mana: 15,
    cost: 100,
  },
  strong: {
    name: { 1: "Amplified", 2: "Amplifié" },
    length: 8,
    sequences: {
      fire: 31413321,
      ice: 41322432,
      poison: 31423213,
      shock: 23142342,
    },
    damage: 6,
    mana: 30,
    cost: 200,
  },
};

const SKILL_FX = {
  size: 15,
  speed: 1000,
  range: 5,
};

const SKILLS = {
  fire: {
    name: { 1: "Fireball", 2: "Flamme Arcanique" },
    sequence: 12,
    stats: {
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
  ice: {
    name: { 1: "Hailstorm", 2: "Tempête Verglaçante" },
    sequence: 23,
    stats: {
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
  poison: {
    name: { 1: "Venom Spray", 2: "Pluie Venimeuse" },
    sequence: 23,
  },
  shock: {
    name: { 1: "Electro Surge", 2: "Surge Électrique" },
    sequence: 34,
  },
};

const SKILLS_OLD = {
  fire_weak: {
    name: { 1: "Weak Fireball", 2: "Boule de feu faible" },
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
    name: { 1: "Weak Icicle", 2: "Boule de glace faible" },
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

// -------------- ACTORS

const SPRITES = {
  velocity: 2.5,
  animation_speed: 0.25,
};

const STATES = { RUN: "run", IDLE: "idle", DEATH: "death", CAST: "cast" };

const PLAYER = {
  name: { 1: "Player", 2: "Joueur" },
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
    name: { 1: "orc", 2: "orc" },
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
    name: { 1: "orc", 2: "orc" },
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
  strength: {
    1: ["weak", "medium", "strong"],
    2: ["faible", "moyen", "puissant"],
  },
  adjective: {
    1: ["Vile", "Ugly", "Stinky"],
    2: ["Dégoutant", "Laide", "Nocif"],
  },
  prefix: { 1: "of", 2: "de" },
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
