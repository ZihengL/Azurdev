function General(spawnpoint, enemyDirection) {
  var playerSpawn = new Vector2D(100, 100);
  var cpuSpawn = new Vector2D(900, 900);

  this.lastFrameTime = performance.now();
  this.player = new General(playerSpawn, cpuSpawn);
  this.cpu = new General(cpuSpawn, playerSpawn);
}

General.prototype.update = function (deltaTime) {
  this.units.forEach(function (unit) {
    unit.update(deltaTime);
  });
};

General.prototype.render = function (ctx) {
  this.units.forEach(function (unit) {
    unit.render(ctx);
  });
};

// class General {
//   constructor(spawnpoint, enemyDirection) {
//     this.units = [];
//     this.spawnpoint = spawnpoint;
//     this.enemyDirection = enemyDirection;
//   }

//   update(deltaTime) {
//     this.units.forEach((unit) => unit.update(deltaTime));
//   }

//   render(ctx) {
//     this.units.forEach((unit) => unit.render(ctx));
//   }

//   async spawnUnit(file) {}
// }
