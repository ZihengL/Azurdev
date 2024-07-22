// -------------- BASICS

const KEYMAPS = {
  screen_game: {
    ArrowUp: 1,
    ArrowDown: 2,
    ArrowLeft: 3,
    ArrowRight: 4,
    1: ["1", "ArrowLeft", "a"],
    2: ["2", "ArrowUp", "w"],
    3: ["3", "ArrowDown", "s"],
    4: ["4", "ArrowRight", "d"],
    CANCEL_SPELL: ["5", "z"],
    PAUSE: ["8", "p"],
    EXIT: ["Escape", "461", "1001", "1009", "9"],
  },
  screen_map: {
    ArrowUp: "MAP_SELECT_UP",
    ArrowDown: "MAP_SELECT_DOWN",
    ArrowLeft: "MAP_SELECT_LEFT",
    ArrowRight: "MAP_SELECT_RIGHT",
    PLAY: ["1", "ArrowUp"],
    MAP_TO_MAIN: ["2", "ArrowDown", "Escape", "461", "1001", "1009"],
    MAP_TO_SHOP: ["3", "ArrowRight"],
    REDUCE_LEVEL: ["8", "ArrowLeft"],
    RAISE_LEVEL: ["9", "ArrowRight"],
  },
  screen_main: {
    CHANGE_LANGUAGE: ["3", "q"],
    CONTINUE_GAME: ["1", "ArrowUp"],
    NEW_GAME: ["2", "ArrowDown"],
  },
};

const KEYS = {
  IN_GAME: {
    ArrowUp: 1,
    ArrowDown: 2,
    ArrowLeft: 3,
    ArrowRight: 4,
    Enter: "PAUSE",
    1001: "PAUSE",
    1009: "PAUSE",
    backspace: "PAUSE",
  },
  MENUS: {
    ArrowUp: "SELECT_UP",
    ArrowDown: "SELECT_DOWN",
    ArrowLeft: "SELECT_LEFT",
    ArrowRight: "SELECT_RIGHT",
    Enter: "PAUSE",
    1001: "PAUSE",
    1009: "PAUSE",
    backspace: "PAUSE",
  },
};

// -------------- MENUS

const LANGS = [1, 2];

const SCREEN = {
  layers: ["backgrounds", "actors", "effects", "ui"],
  width: 1280,
  height: 720,
  fps: [15, 30, 60],
};

const SCREENS = {
  screen_main: { id: "screen_main", nav: "screen_main_btns" },
  screen_map: {
    id: "screen_map",
    nav: "screen_map_btns",
  },
  screen_game: { id: "screen_game", nav: "screen_game_btns" },
};

const DISPLAY = {
  elements: {
    screen_main: {
      menu_title: { 1: "COMBO-MAGE", 2: "MÉMO-MAGE" },
      btn_lang: { 1: "FR", 2: "EN" },
      btn_continue: { 1: "Continue", 2: "Continuer" },
      btn_newgame: { 1: "New game", 2: "Nouveau Jeu" },
    },
    screen_map: {
      selected_level: {
        1: "Choose your adventure",
        2: "Choisissez votre aventure",
      },
      btn_shop: { 1: "Shop", 2: "Magasin" },
      btn_play: { 1: "Play", 2: "Jouer" },
      btn_back: { 1: "Back", 2: "Retour" },
    },
    screen_game: {
      btn_quitLevel: { 1: "Back", 2: "9 Retour" },
      btn_unpause: { 1: "Unpause", 2: "Démarrer" },
      btn_pause: { 1: "Pause", 2: "Pause" },
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
  forest: [
    {
      multiplier: 0.03,
      grounded: true,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 0,
      grounded: false,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 0.05,
      grounded: true,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 1,
      grounded: true,
      position: { x: 0, y: 0 },
    },
  ],
  mountains: [
    {
      multiplier: 0,
      grounded: false,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 0.03,
      grounded: true,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 0.05,
      grounded: true,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 0.1,
      grounded: true,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 1,
      grounded: true,
      position: { x: 0, y: 0 },
    },
  ],
  industrial: [
    {
      multiplier: 0,
      grounded: true,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 0.05,
      grounded: true,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 0.1,
      grounded: true,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 1,
      grounded: true,
      position: { x: 0, y: 0 },
    },
  ],
  space: [
    {
      multiplier: 0,
      grounded: false,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 0.003,
      grounded: false,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 0.05,
      grounded: false,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 0.1,
      grounded: false,
      position: { x: 0, y: 0 },
    },
    {
      multiplier: 1,
      grounded: false,
      position: { x: 0, y: 0 },
    },
  ],
};

// -------------- SKILLS & EFFECTS

const AFFINITIES = [
  {
    name: { 1: "fire", 2: "feux" },
    color: "red",
    cast_effect: "cast_fire",
  },
  {
    name: { 1: "ice", 2: "glace" },
    color: "blue",
    cast_effect: "cast_ice",
  },
  {
    name: { 1: "poison", 2: "poison" },
    color: "green",
    cast_effect: "cast_poison",
  },
  {
    name: { 1: "shock", 2: "électrique" },
    color: "blue",
    cast_effect: "cast_shock",
  },
];

const SKILL_FX = {
  size: 15,
  speed: 1000,
  range: 5,
};

const SPELLS = {
  // FIRE
  1334: {
    name: { 1: "Scorch", 2: "Feu Torride" },
    sequence: 1334,
    affinity: 0,
    damage: 1,
    cooldown: 1,
    manacost: 5,
    cost: 50,
    image: "",
  },
  2232: {
    name: { 1: "Fireball", 2: "Flamme Arcanique" },
    sequence: 2232,
    affinity: 0,
    damage: 3,
    cooldown: 1,
    manacost: 5,
    cost: 50,
    image: "",
  },
  // ICE
  3321: {
    name: { 1: "Hailstorm", 2: "Tempête Verglaçante" },
    sequence: 3321,
    affinity: 1,
    damage: 3,
    cooldown: 1,
    manacost: 5,
    cost: 50,
    image: "",
  },
  // POISON
  2232: {
    name: { 1: "Venom Spray", 2: "Pluie Venimeuse" },
    sequence: 2232,
    affinity: 2,
    damage: 3,
    cooldown: 1,
    manacost: 5,
    cost: 50,
    image: "",
  },
  // SHOCK
  4422: {
    name: { 1: "Electro Surge", 2: "Surge Électrique" },
    sequence: 4422,
    affinity: 3,
    damage: 3,
    cooldown: 1,
    manacost: 5,
    cost: 50,
    image: "",
  },
};

// -------------- ACTORS

const SPRITES = {
  velocity: 2.5,
  animation_speed: 0.25,
};

const STATES = { RUN: "run", IDLE: "idle", DEATH: "death", CAST: "cast" };

const LOCALSTORAGE = {
  key: "Combomage",
  defaults: {
    stats: {
      health: 5,
      damage: 1,
      potions: 1,
      mana: 20,
      mana_regen_sec: 0.5,
    },
    gold: 100,
    level_progress: 0,
    spells: [1334, 3321, 2232, 4422],
  },
};

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
    elements: {
      1: "1-img",
      2: "2-img",
      3: "3-img",
      4: "4-img",
      health_container: "p_health_container",
      health_text: "p_health_text",
      health_overlay: "p_health_fill_overlay",
      health: "p_health_fill",
      mana_container: "p_mana_container",
      mana_text: "p_mana_text",
      mana_overlay: "p_mana_fill_overlay",
      mana: "p_mana_fill",
      damage: "p_damage",
      sequence: "p_sequence",
      input: "p_input",
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
  fx: {
    elements: {
      ui: "o_ui",
      name: "o_name",
      damage: "o_damage",
      health_container: "o_health_container",
      health_overlay: "o_health_fill_overlay",
      health: "o_health_fill",
      cooldown_container: "o_cooldown_container",
      cooldown: "o_cooldown_fill",
    },
    position: {
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
    sprites: {
      scale: 1,
      frame: {
        width: 120,
        height: 190,
        bleed: 20,
      },
    },
  },
};

const OPPONENTS = [
  // SKELETONS
  {
    name: { 1: "Skeleton", 2: "Skelette" },
    image: "player",
    rows: { run: 5, idle: 6, death: 4, cast: 3 },
    health: 3,
    cooldown: 5,
    // damage_multiplier: 0.5,
    // health_multiplier: 0.5,
    // cooldown_multiplier: 0.8,
  },
  {
    name: { 1: "Goblin", 2: "Goblin" },
    image: "player",
    rows: { run: 5, idle: 6, death: 4, cast: 3 },
    health: 5,
    cooldown: 5,
    // damage_multiplier: 0.5,
    // health_multiplier: 0.5,
    // cooldown_multiplier: 0.8,
  },
  // ORCS
  {
    name: { 1: "Orc", 2: "Orc" },
    image: "player",
    rows: { run: 5, idle: 6, death: 4, cast: 3 },
    health: 10,
    cooldown: 5,
    // damage_multiplier: 0.75,
    // health_multiplier: 0.75,
    // cooldown_multiplier: 1,
  },
  // VAMPIRES
  {
    name: { 1: "Vampire", 2: "Vampire" },
    image: "player",
    rows: { run: 5, idle: 6, death: 4, cast: 3 },
    health: 20,
    cooldown: 5,
    // damage_multiplier: 1,
    // health_multiplier: 1.5,
    // cooldown_multiplier: 0.3,
  },
];

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
    scene: "forest",
    payout: 100,
    mob_count: 5,
    mob_types: [0, 1],
    mob_spells: [1334],
  },
  {
    scene: "forest",
    payout: 200,
    mob_count: 8,
    mob_types: [0, 1, 2],
    mob_spells: [1334, 3321],
  },
  // {
  //   scene: "forest",
  //   payout: 150,
  //   opponents: {
  //     scene: 0,
  //     count: 5,
  //     base: {
  //       health: 2,
  //       cooldown: 3,
  //     },
  //     modifiers: {
  //       types: [0, 1],
  //       power: 0,
  //       strengths: [0, 0],
  //       affinities: [0],
  //     },
  // },
  // },
];

// const SKILLS = {
//   fire: {
//     name: { 1: "Fireball", 2: "Flamme Arcanique" },
//     sequence: 12,
//     stats: {
//       affinity: "fire",
//       cooldown: 1,
//       damage: 1,
//       mana_cost: 5,
//     },
//     fx: {
//       color: "red",
//       size: 15,
//       speed: 1000,
//       range: 5,
//     },
//   },
//   ice: {
//     name: { 1: "Hailstorm", 2: "Tempête Verglaçante" },
//     sequence: 23,
//     stats: {
//       affinity: "ice",
//       cooldown: 1,
//       damage: 1,
//       mana_cost: 5,
//     },
//     fx: {
//       color: "blue",
//       size: 15,
//       speed: 1000,
//       range: 5,
//     },
//   },
//   poison: {
//     name: { 1: "Venom Spray", 2: "Pluie Venimeuse" },
//     sequence: 23,
//     stats: {
//       affinity: "poison",
//       cooldown: 1,
//       damage: 1,
//       mana_cost: 5,
//     },
//   },
//   shock: {
//     name: { 1: "Electro Surge", 2: "Surge Électrique" },
//     sequence: 34,
//     stats: {
//       affinity: "shock",
//       cooldown: 1,
//       damage: 1,
//       manacost: 5,
//     },
//   },
// };

// const SKILL_LEVELS = [
//   {
//     name: { 1: "Dilute", 2: "Vacillant" },
//     length: 4,
//     sequences: [1134, 2232, 3321, 4422],
//     damage: 1,
//     mana_cost: 5,
//     cost: 50,
//   },
//   {
//     name: { 1: "Middling", 2: "Tempéré" },
//     length: 6,
//     sequences: [131422, 232433, 324211, 442144],
//     damage: 3,
//     mana_cost: 15,
//     cost: 100,
//   },
//   {
//     name: { 1: "Amplified", 2: "Amplifié" },
//     length: 8,
//     sequences: [31413321, 41322432, 31423213, 23142342],
//     damage: 6,
//     mana_cost: 30,
//     cost: 200,
//   },
// ];
