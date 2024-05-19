

// function Game(lang, keymap, profile) {
//   this.keymap = keymap || KEYMAPS.PC;
//   this.lang = lang || LANGS[0];
//   this.save = profile;

//   this.menu = new MainMenu(this);
//   this.map = new MapMenu(this);
//   this.level = new Level(Game.res, this.save, this.keymap, this);

//   this.switchToMainMenu();
// }
// Game.res = {};

// Game.load = function () {
//   return Background.load().then(function (layers) {
//     Game.res.background = layers;

//     return Player.load().then(function (playerRes) {
//       Game.res.player = playerRes;

//       return Opponent.load().then(function (opponentRes) {
//         Game.res.opponent = opponentRes;
//       });
//     });
//   });
// };