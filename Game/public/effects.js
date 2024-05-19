function Effects(caster, duration, effect) {
  this.res = {};
  this.effects = {};
  this.caster = caster;
  this.duration = duration;
  this.effect = effect;

  this.remaining = this.duration;
}

Effects.load = function () {
  const effects = {};
  var sequence = Promise.resolve();

  for (var key in AFFINITIES) {
    const skill = AFFINITIES[key];
    const path = skill.fx.cast_effect;

    sequence = sequence.then(function () {
      return loadImage(path).then(function (image) {
        effects[key] = {
          image: image,
        };
      });
    });
  }

  return sequence.then(function () {
    return effects;
  });
};

Effects.prototype.addSkillEffect = function (res, skill) {};
