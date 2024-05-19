// function MapMenu(game) {
//   this.game = game;
//   this.init();
// }
// MapMenu.div = "map_menu";
// MapMenu.level_select = "level_selection";

// MapMenu.prototype.init = function () {
//   const container = document.getElementById(MapMenu.level_select);
//   const self = this;

//   for (var i = 0; i < LEVELS.length; i++) {
//     const levelBtn = document.createElement("button");
//     levelBtn.id = MAPMENU.buttons.lvl_id + i;
//     levelBtn.textContent = i + 1;
//     levelBtn.onclick = (function (level) {
//       return function () {
//         self.updateLevelSelection(level);
//       };
//     })(i);

//     container.appendChild(levelBtn);
//   }
//   this.updateLevelSelection(this.game.save.level_progress);
// };

// MapMenu.prototype.update = function () {
//   const container = document.getElementById(MapMenu.level_select);

//   for (var i = 0; i < LEVELS.length; i++) {
//     const levelBtn = getFromContainer(container, MAPMENU.buttons.lvl_id + i);
//     const availability = this.isWithinPlayerProgress(i) ? 1 : 0;

//     levelBtn.className = MAPMENU.buttons.lvl_class + availability;
//     levelBtn.disabled = !availability;
//   }
// };

// MapMenu.prototype.updateLevelSelection = function (level) {
//   if (this.isWithinPlayerProgress(level)) {
//     const displayText = this.game.getInLang(MAPMENU.display.title);

//     document.getElementById("selected_level").textContent = displayText + level;
//     this.selectedLevel = level;
//   }
// };

// MapMenu.prototype.isWithinPlayerProgress = function (level) {
//   return level <= profile.level_progress;
// };

// ------------

// MapMenu.init = function () {
//   const container = document.getElementById(MapMenu.level_select);

//   for (var i = 0; i < LEVELS.length; i++) {
//     const levelBtn = document.createElement("button");
//     levelBtn.id = MAPMENU.buttons.lvl_id + i;
//     levelBtn.textContent = i + 1;
//     levelBtn.onclick = (function (level) {
//       return function () {
//         MapMenu.updateLevelSelection(level);
//       };
//     })(i);

//     container.appendChild(levelBtn);
//   }

//   MapMenu.updateLevelSelection(profile.level_progress);
// };

// MapMenu.update = function () {
//   const container = document.getElementById(MapMenu.level_select);

//   for (var i = 0; i < LEVELS.length; i++) {
//     const levelBtn = getFromContainer(container, MAPMENU.buttons.lvl_id + i);
//     const availability = isWithinPlayerProgress(i) ? 1 : 0;

//     levelBtn.className = MAPMENU.buttons.lvl_class + availability;
//     levelBtn.disabled = !availability;
//   }
// };

// MapMenu.updateLevelSelection = function (level) {
//   if (isWithinPlayerProgress(level)) {
//     const displayText = getInLang(MAPMENU.display.title);

//     document.getElementById("selected_level").textContent = displayText + level;
//     selectedLevel = level;
//   }
// };
