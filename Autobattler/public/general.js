function General(spawnpoint) {
  this.spawnpoint = spawnpoint;
  this.units = [];
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

General.prototype.spawnUnit = function (file) {
  var unit = Unit.createInstance(file);

  this.units.push(unit);
};


