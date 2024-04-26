function Skill(config, player) {
  const skill = SKILLS[config];

  this.name = config;
  this.sequence = skill.stats.sequence;
  this.stats = skill.stats;
  this.fx = skill.fx;

  this.player = player;
  // this.sequencing = [];
  this.sequenceIdx = 0;
  this.cooldown = 0;

  this.projectiles = [];
}

// -------------- UPDATE & RENDER

Skill.prototype.update = function (deltaTime) {
  this.projectiles = this.projectiles.filter(
    function (projectile) {
      projectile.update(deltaTime);

      if (projectile.isOnTarget()) {
        projectile.target.applyEffect(this.stats);
        return false;
      }

      return true;
    }.bind(this)
  );

  if (this.isOnCD()) {
    this.cooldown -= deltaTime;
    // this.cooldown = Math.max(0, this.cooldown);
  }
};

Skill.prototype.render = function () {
  this.projectiles.forEach(
    function (projectile) {
      projectile.render();
    }.bind(this)
  );
};

Skill.prototype.renderUI = function (pos) {
  const size = 100;

  surface.ctx.fillStyle = this.fx.color;
  surface.ctx.fillRect(pos, 320, size, size);

  if (this.isOnCD()) {
    const cdSize = size - this.cooldown * size;
    surface.ctx.fillRect(pos, 320, cdSize, size);
  }
};

// -------------- OTHER

Skill.prototype.inputSequence = function (inputArcane) {
  if (!this.isOnCD()) {
    const currentArcane = this.sequence[this.sequenceIdx];

    if (inputArcane === currentArcane) {
      this.sequenceIdx++;
    } else {
      if (this.sequenceIdx > 0) {
        this.sequenceIdx = 0;
        this.cooldown = this.stats.cooldown;
      }
    }
    console.log(this.name, inputArcane, currentArcane, this.sequenceIdx);
    
    return this.sequenceIdx > this.sequence.length - 1;
  }
};

Skill.prototype.isOnCD = function () {
  return this.cooldown > 0;
};

Skill.prototype.getTarget = function (mobs) {
  return mobs[0];
};

Skill.prototype.cast = function (mobs) {
  const playerCenter = this.player.pos.center(this.player.size);
  const target = this.getTarget(mobs);
  const projectile = new Projectile(playerCenter, target, this.fx);

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
