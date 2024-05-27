// const UI = {
//   actors: {
//     player: {
//       nameplate: {
//         font: "48px serif",
//         fillStyle: "blue",
//         textAlign: "left",
//         textBaseline: "middle",
//         shadowColor: "rgba(0, 0, 0, 0.5)",
//         shadowBlur: 4,
//         shadowOffsetX: 20,
//         shadowOffsetY: 5,
//         start: { x: 0.05, y: 0.1 },
//       },
//       status_bars: {
//         health: {
//           color: "#A91D3A",
//           missing: "#FCF5ED",
//           start: { x: 0.05, y: 0.2 },
//           end: { x: 0.4, y: 0.23 },
//         },
//         mana: {
//           color: "#2C4E80",
//           missing: "#C4E4FF",
//           start: { x: 0.05, y: 0.24 },
//           end: { x: 0.4, y: 0.245 },
//         },
//       },
//     },
//     opponent: {
//       nameplate: {
//         font: "48px serif",
//         fillStyle: "red",
//         textAlign: "right",
//         textBaseline: "middle",
//         shadowColor: "rgba(0, 0, 0, 0.5)",
//         shadowBlur: 4,
//         shadowOffsetX: 5,
//         shadowOffsetY: 5,
//         start: { x: 0.95, y: 0.1 },
//       },
//       status_bars: {
//         health: {
//           color: "#A91D3A",
//           missing: "#C4E4FF",
//           start: { x: 0.6, y: 0.2 },
//           end: { x: 0.95, y: 0.23 },
//         },
//         cooldown: {
//           color: "#FCF5ED",
//           missing: "#00224D",
//           start: { x: 0.6, y: 0.24 },
//           end: { x: 0.95, y: 0.245 },
//         },
//       },
//     },
//   },
//   skills: {},
//   status: {
//     win: {
//       value: ["VICTORY", "VICTOIRE"],
//       delay: 0,
//       font: "82px serif",
//       fontSize: 0.26,
//       fillStyle: "green",
//       textAlign: "center",
//       textBaseline: "middle",
//       start: { x: 0.5, y: 0.5 },
//     },
//     lose: {
//       value: ["DEFEAT", "DÉFAITE"],
//       delay: 1,
//       font: "82px serif",
//       fillStyle: "red",
//       textAlign: "center",
//       textBaseline: "middle",
//       start: { x: 0.5, y: 0.5 },
//     },
//     pause: {
//       value: ["PAUSED", "PAUSE"],
//       delay: 1,
//       font: "82px serif",
//       fillStyle: "red",
//       textAlign: "center",
//       textBaseline: "middle",
//       start: { x: 0.5, y: 0.5 },
//     },
//   },
//   killcount: {
//     x: 100,
//     y: 100,
//     value: "Score: ",
//     font: "24px Arial",
//     fillStyle: "black",
//     textAlign: "center",
//     textBaseline: "middle",
//   },
// };

// const SHIELDS = {
//   fire_shield_weak: {
//     name: { 1: "Weak fire Shield", 2: "Bouclier de feu faible" },
//     stats: {
//       affinity: "fire",
//       health: 1,
//     },
//     fx: {},
//   },
// };

const OPPONENTS2 = {
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
