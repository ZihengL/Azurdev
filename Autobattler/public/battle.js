function Battle() {
  var playerSpawn = new Vector2D(100, 100);
  var cpuSpawn = new Vector2D(900, 100);

  this.player = new General(playerSpawn, cpuSpawn);
  this.cpu = new General(cpuSpawn, playerSpawn);
}

// =============================== STATIC

Battle.createInstance = function (files) {
  return SpriteHandler.preloadResources(files).then(function () {
    return new Battle();
  });
};

// =============================== INSTANCE

Battle.prototype.update = function (deltaTime) {
  this.player.update(deltaTime);
  this.cpu.update(deltaTime);
};

Battle.prototype.render = function (surface) {
  this.player.render(surface);
  this.cpu.render(surface);
};
