function Skill(affinity, strength, caster) {
  // const skill = SKILLS[config];
  const stats = SKILL_LEVELS[strength];

  this.name = getSkillName(affinity, strength);
  this.affinity = affinity;
  this.strength = strength;
  this.damage = stats.damage;
  this.manacost = stats.mana_cost;
  this.cost = stats.cost;

  this.sequence = stats.sequences[affinity].toString();
  this.stats = stats;
  this.fx = SKILL_FX;

  this.caster = caster;
  // this.sequenceIdx = 0;
  // this.cooldown = 0;
  // this.projectiles = [];
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

Skill.codeToInstance = function (code, caster) {
  const segments = code.split("-");

  return new Skill(segments[0], segments[1], caster);
};

Skill.prototype.toCode = function () {
  return this.affinity + "-" + this.strength;
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

  // if (this.isOnCD()) {
  //   this.cooldown -= deltaTime;
  // }
};

Skill.prototype.render = function () {
  this.projectiles.forEach(
    function (projectile) {
      projectile.render();
    }.bind(this)
  );
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

Skill.prototype.renderCastEffect = function () {
  if (this.castEffect && this.castEffect.opacity > 0) {
    surface.drawCastEffect(
      this.castEffect.image,
      this.castEffect,
      this.sequenceIdx
    );
  }
};

Skill.prototype.validInput = function (sequence) {
  console.log(
    "VALIDINPUT",
    this.sequence,
    sequence,
    this.sequence.indexOf(sequence)
  );

  return this.sequence.indexOf(sequence) === 0;
};

Skill.prototype.atEndOfSequence = function (sequence) {
  return this.sequence.length === sequence.length;
};

// -------------- OTHER

Skill.prototype.inputSequence = function (inputValue) {
  if (inputValue && !this.isOnCD()) {
    const currentValue = this.sequence[this.sequenceIdx];

    if (inputValue === currentValue) {
      this.sequenceIdx++;
    } else {
      this.sequenceIdx = 0;
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

Skill.prototype.createProjectile = function () {
  const projectile = new Projectile(
    this.caster.opponent,
    this.damage,
    this.affinity,
    this.caster.bodyCenter(),
    this.fx
  );

  this.caster.projectiles.push(projectile);
};

Skill.prototype.applyEffect = function (target) {
  const casterCenter = this.caster.pos.center(this.caster.size);
  const projectile = new Projectile(casterCenter, target, this.fx);

  this.projectiles.push(projectile);
  // this.cooldown = this.stats.cooldown / 2;
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

// Skill.prototype.setCastEffect = function (image) {
//   const effect = AFFINITIES[this.stats.affinity].effect;

//   this.castEffect = {
//     image: image,
//     width: effect.width,
//     height: effect.height,
//     delay: 0,
//     opacity: 0,
//     scale: 0,
//     angle: 0,
//   };
// };
