function Spell(id) {
  const options = SPELLS[id];

  this.sequence = id.toString();
  // this.name = options.name;
  this.affinity = options.affinity;
  this.damage = options.damage;
  this.cooldown = options.cooldown;
  this.manacost = options.manacost;

  this.fx = SKILL_FX;
}

// -------------- STATIC

Spell.load = function () {
  const spells = {};
  var sequence = Promise.resolve();

  for (var key in SPELLS) {
    const spell = SPELLS[key];
    const path = spell.effect.cast;

    sequence = sequence.then(function () {
      return loadImage(path).then(function (image) {
        spells[key] = {
          effect: image,
        };
      });
    });
  }

  return sequence.then(function () {
    return spells;
  });
};



// -------------- MISC



Spell.prototype.validateSequence = function (sequence) {
  const index = this.sequence.indexOf(sequence);
  console.log(this.sequence, sequence, index);

  return index === 0;
};

Spell.prototype.isEqualLength = function (sequence) {
  return this.sequence.length === sequence.length;
};

Spell.prototype.isCastable = function (player) {
  return this.isEqualLength(player.sequence) && player.mana >= this.manacost;
};

Spell.prototype.createProjectile = function (origin, target) {
  return new Projectile(
    origin,
    target,
    this.damage,
    this.affinity,
    this.fx
  );
};

// Spell.prototype.getID = function () {
//   return this.affinity + "-" + this.strength;
// };

// Spell.getInstanceFromID = function (code, caster) {
//   const segments = code.split("-");

//   return new Spell(segments[0], segments[1], caster);
// };

// Spell.prototype.applyEffect = function (target) {
//   const casterCenter = this.caster.pos.center(this.caster.size);
//   const projectile = new Projectile(casterCenter, target, this.fx);

//   this.projectiles.push(projectile);
//   this.sequenceIdx = 0;
// };

// Spell.prototype.inputSequence = function (inputValue) {
//   if (inputValue && !this.isOnCD()) {
//     const currentValue = this.sequence[this.sequenceIdx];

//     if (inputValue === currentValue) {
//       this.sequenceIdx++;
//     } else {
//       this.sequenceIdx = 0;
//     }

//     return this.sequenceIdx > this.sequence.length - 1;
//   }

//   return false;
// };

// Spell.prototype.isCorrectInput = function (index, inputValue) {
//   return this.sequence[index] === inputValue;
// };

// Spell.prototype.isOnCD = function () {
//   return this.cooldown > 0;
// };

// Spell.prototype.cast = function () {
//   const casterCenter = this.caster.bodyCenter();
//   const projectile = new Projectile(
//     casterCenter,
//     this.caster.opponent,
//     this.fx
//   );

//   this.projectiles.push(projectile);
//   this.sequenceIdx = 0;
// };

// Spell.prototype.update = function (deltaTime) {
//   const self = this;

//   this.projectiles = this.projectiles.filter(
//     function (projectile) {
//       projectile.update(deltaTime);

//       if (projectile.isWithinRange()) {
//         projectile.target.applyEffect(self.stats);
//         return false;
//       }

//       return !projectile.target.isDead();
//     }.bind(this)
//   );
// };

// Spell.prototype.render = function () {
//   this.projectiles.forEach(
//     function (projectile) {
//       projectile.render();
//     }.bind(this)
//   );
// };

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

// Spell.prototype.updateCastEffect = function (deltaTime) {
//   if (this.castEffect) {
//     const increments = EFFECTS.cast_effect;
//     var delay = this.castEffect.delay;
//     var opacity = this.castEffect.opacity;
//     var angle = this.castEffect.angle;

//     if (this.sequenceIdx > 0) {
//       delay = increments.delay;
//       opacity = Math.min(opacity + increments.opacity, 1);
//     } else if (delay > 0) {
//       delay -= deltaTime;
//     } else {
//       opacity = Math.max(opacity - increments.opacity, 0);
//     }

//     angle += increments.angle;
//     if (this.castEffect.angle > 2) {
//       angle = 0;
//     }

//     this.castEffect.delay = delay;
//     this.castEffect.opacity = opacity;
//     this.castEffect.angle = angle;
//   }
// };

// Spell.prototype.renderCastEffect = function () {
//   if (this.castEffect && this.castEffect.opacity > 0) {
//     surface.drawCastEffect(
//       this.castEffect.image,
//       this.castEffect,
//       this.sequenceIdx
//     );
//   }
// };
