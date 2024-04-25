function Skill(config, player) {
  const skill = SKILLS[config];

  this.name = config;
  this.sequence = skill.sequence;
  this.stats = skill.stats;
  this.fx = skill.fx;

  this.player = player;
  this.projectiles = [];
  this.sequenceIdx = 0;

  // this.button = document.getElementById(`btn_${id}`);
  // this.button.innerText = config;
  // this.button.addEventListener(
  //   "click",
  //   function () {
  //     if (player.mana >= stats.mana) {
  //       player.mana -= stats.mana;

  //       const playerCenter = player.pos.center(player.size);
  //       const target = player.enemies[0]; // CHANGE LATER
  //       const projectile = new Projectile(playerCenter, target, this.config);

  //       this.projectiles.push(projectile);
  //     }
  //   }.bind(this)
  // );
}

Skill.prototype.update = function (deltaTime) {
  // const skill = this;

  // for (let i = this.projectiles.length - 1; i >= 0; i--) {
  //   const projectile = this.projectiles[i];
  //   const target = projectile.target;
  //   const targetCenter = target.pos.center(target.size);

  //   if (!projectile.pos.isEqual(targetCenter)) {
  //     const direction = projectile.pos.direction(targetCenter);
  //     projectile.velocity = direction.multiply(skill.speed);

  //     const displacement = projectile.velocity.multiply(deltaTime);
  //     projectile.pos = projectile.pos.add(displacement);
  //   } else {
  //     if (target.applyDamage(skill.stats.damage)) {
  //       console.log("DMG APPLIED", target.health);
  //     }

  //     this.projectiles.splice(i, 1);
  //   }
  // }

  this.projectiles = this.projectiles.filter(
    function (projectile) {
      projectile.update(deltaTime);

      if (projectile.isOnTarget()) {
        projectile.target.applyDamage(this.stats.damage);
        return false;
      }

      return true;
    }.bind(this)
  );
};

Skill.prototype.render = function () {
  this.projectiles.forEach(
    function (projectile) {
      projectile.render();
    }.bind(this)
  );
};

// TODO: IF LASTKEYPRESSED IS VALID FOR CURRENT SEQUENCE IDX, GO TO NEXT INDEX.
Skill.prototype.inputSequence = function (inputLetter) {
  const currentLetter = this.sequence[this.sequenceIdx];

  console.log(inputLetter, currentLetter);
  if (inputLetter === currentLetter) {
    this.sequenceIdx++;

    if (this.sequenceIdx >= this.sequence.length - 1) {
      const targetMob = this.getTarget();

      this.cast(targetMob);
      this.sequenceIdx = 0;
    }

    return this.sequenceIdx >= this.sequence.length - 1;
  }
};

// todo: CHANGE THIS
Skill.prototype.getTarget = function () {
  const mobs = this.player.level.mobs;

  return mobs[0];
};

Skill.prototype.cast = function (targetMob) {
  const playerCenter = this.player.pos.center(this.player.size);
  const projectile = new Projectile(playerCenter, targetMob, this.fx);

  this.projectiles.push(projectile);
  this.sequenceIdx = 0;
};
