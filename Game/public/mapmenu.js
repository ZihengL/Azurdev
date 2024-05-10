function MapMenu(game) {
  this.game = game;

  this.init();
}
MapMenu.div = "map_menu";
MapMenu.level_select = "level_selection";

MapMenu.prototype.init = function () {
  const save = this.game.save;
  const container = document.getElementById(MapMenu.level_select);
  const game = this.game;

  //   while (container.firstChild) {
  //     container.removeChild(container.firstChild);
  //   }

  for (var i = 0; i <= save.level_progress; i++) {
    var levelBtn = document.createElement("button");
    levelBtn.innerHTML = i;
    levelBtn.onclick = function () {
      game.switchToGame(i);
    };

    console.log("APPEND LEVEL", i, levelBtn);
    container.appendChild(levelBtn);
  }

  console.log(container, save);
};
