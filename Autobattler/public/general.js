function General(spawnpoint, opponentspawn) {
  this.spawnpoint = spawnpoint;
  this.opponentspawn = opponentspawn;
  this.units = [];
}

General.prototype.update = function (deltaTime) {
  this.units.forEach(function (unit) {
    unit.update(deltaTime);
  });
};

General.prototype.render = function (surface) {
  this.units.forEach(function (unit) {
    unit.render(surface);
  });
};

General.prototype.spawnUnit = function (file, currentTime) {
  var unit = new Unit(file, this.spawnpoint, currentTime);
  unit.target = this.opponentspawn;

  this.units.push(unit);
};


