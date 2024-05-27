function Skill(config, caster, strength) {
  const skill = SKILLS[config];

  this.name = config;
  this.sequence = skill.stats.sequence;
  this.stats = skill.stats;
  this.fx = skill.fx;

  this.caster = caster;
  this.sequenceIdx = 0;
  this.cooldown = 0;
  this.projectiles = [];
}

Skill.load = function () {
  const skills = {};
  var sequence = Promise.resolve();

  for (var key in AFFINITIES) {
    const affinity = AFFINITIES[key];
    const path = affinity.effect.cast;

    sequence = sequence.then(function () {
      return loadImage(path).then(function (image) {
        skills[key] = {
          effect: image,
        };
      });
    });
  }

  return sequence.then(function () {
    return skills;
  });
};

// -------------- UPDATE & RENDER

Skill.prototype.update = function (deltaTime) {
  const self = this;

  this.projectiles = this.projectiles.filter(
    function (projectile) {
      projectile.update(deltaTime);

      if (projectile.isWithinRange()) {
        projectile.target.applyEffect(self.stats);
        return false;
      }

      return !projectile.target.isDead();
    }.bind(this)
  );

  if (this.isOnCD()) {
    this.cooldown -= deltaTime;
  }
};

Skill.prototype.updateCastEffect = function (deltaTime) {
  if (this.castEffect) {
    const increments = EFFECTS.cast_effect;
    var delay = this.castEffect.delay;
    var opacity = this.castEffect.opacity;
    var angle = this.castEffect.angle;

    if (this.sequenceIdx > 0) {
      delay = increments.delay;
      opacity = Math.min(opacity + increments.opacity, 1);
    } else if (delay > 0) {
      delay -= deltaTime;
    } else {
      opacity = Math.max(opacity - increments.opacity, 0);
    }

    angle += increments.angle;
    if (this.castEffect.angle > 2) {
      angle = 0;
    }

    this.castEffect.delay = delay;
    this.castEffect.opacity = opacity;
    this.castEffect.angle = angle;
  }
};

Skill.prototype.render = function () {
  this.projectiles.forEach(
    function (projectile) {
      projectile.render();
    }.bind(this)
  );
};

Skill.prototype.renderCastEffect = function () {
  if (this.castEffect && this.castEffect.opacity > 0) {
    surface.drawCastEffect(
      this.castEffect.image,
      this.castEffect,
      this.sequenceIdx
    );
  }
};

Skill.prototype.renderUI = function (x, y) {
  const size = 25;

  // surface.ctx.fillStyle = this.fx.color;
  // surface.ctx.fillRect(x, y, size, size);

  surface.fillTo("ui", this.fx.color, x, y, size, size);

  if (this.isOnCD()) {
    const cdSize = size - this.cooldown * size;
    // surface.ctx.fillRect(x, y, cdSize, size);

    surface.fillTo("ui", "black", x, y, cdSize, size);
  }
};

// -------------- OTHER

Skill.prototype.setCastEffect = function (image) {
  const effect = AFFINITIES[this.stats.affinity].effect;

  this.castEffect = {
    image: image,
    width: effect.width,
    height: effect.height,
    delay: 0,
    opacity: 0,
    scale: 0,
    angle: 0,
  };
};

Skill.prototype.inputSequence = function (inputValue) {
  if (inputValue && !this.isOnCD()) {
    const currentValue = this.sequence[this.sequenceIdx];

    if (inputValue === currentValue) {
      this.sequenceIdx++;
    } else {
      this.sequenceIdx = 0;
      // this.cooldown = this.stats.cooldown;
      // }
    }

    return this.sequenceIdx > this.sequence.length - 1;
  }

  return false;
};

Skill.prototype.isCorrectInput = function (index, inputValue) {
  return this.sequence[index] === inputValue;
};

Skill.prototype.isOnCD = function () {
  return this.cooldown > 0;
};

Skill.prototype.cast = function () {
  const casterCenter = this.caster.bodyCenter();
  const projectile = new Projectile(
    casterCenter,
    this.caster.opponent,
    this.fx
  );

  this.projectiles.push(projectile);
  this.sequenceIdx = 0;
};

Skill.prototype.applyEffect = function (target) {
  const casterCenter = this.caster.pos.center(this.caster.size);
  const projectile = new Projectile(casterCenter, target, this.fx);

  this.projectiles.push(projectile);
  this.cooldown = this.stats.cooldown / 2;
  this.sequenceIdx = 0;
};

// Skill.prototype.inputSequence = function (inputArcane) {
//   if (this.sequencing.length >= this.sequence.length) {
//     this.sequencing.shift();
//   }
//   this.sequencing.push(inputArcane);

//   console.log(inputArcane, this.sequencing);
//   return this.checkSequence();
// };

// Skill.prototype.checkSequence = function () {
//   for (var i = 0; i < this.sequence.length; i++) {
//     const sequencingArc = this.sequencing[i];
//     const sequenceArc = this.sequence[i];

//     if (this.sequencing[i] !== this.sequence[i]) {
//       return false;
//     }
//   }

//   return true;
// };
