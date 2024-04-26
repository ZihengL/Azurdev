// ! RESTRICTION:
// ! Do not use ES6 syntax, use only ES5 and older
// ! Do not use jQuery library
// ! Do not use any frameworks
// * If you use any imported library check it by top restrictions

// CHROMIUM V38 broswerling.com - 000webhost.org
// Inspect >
// ZiGameAzur - Autobattler!23

// 6 MAX SPELLS
// ENEMY VULNERABILITIES
// ENEMY HAVE DEFENSIVE SPELLS IF PLAYER SPAMS. THEY ATTACK IF USER TAKE TOO LONG

// UPLOAD TO HOST

const keymap = KEYMAPS.PC;

var currentLevel = LEVELS[0];

Level.load()
  .then(function () {
    const level = new Level(currentLevel, KEYMAPS.PC);

    level.gameloop(performance.now());
  })
  .catch(function (error) {
    console.error("Failed to load level:", error);
  });
