function Mob(config, player) {
  const mob = MOBS[config] || MOBS.orc_weak;
  this.name = mob.name.en;

  this.stats = mob.stats;
  this.health = this.stats.health;
  this.cooldown = this.stats.cooldown;

  this.fx = mob.fx;
  // this.size = getScreenScalar(this.fx.width, this.fx.height);
  // this.pos = getScreenScalar(this.fx.startX, this.fx.startY - this.fx.height);
  this.size = surface.ratioProportion(this.fx);
  this.pos = surface.ratioProportion(this.fx);
  this.targetPos = surface.ratioProportion();

  this.targetPos = getScreenScalar(
    this.fx.targetX + this.fx.width / 2,
    this.fx.targetY - this.fx.height
  );

  this.player = player;
  this.isTargeted = false;

  this.skills = [];
  this.stats.skills.forEach(
    function (config) {
      const skill = new Skill(config, this);
      this.skills.push(skill);
    }.bind(this)
  );
}

// -------------- UPDATE

Mob.prototype.update = function (deltaTime) {
  if (this.pos.x > this.targetPos.x) {
    this.pos.x = Math.max(this.pos.x - this.fx.speed, this.targetPos.x);
  } else {
    if (!this.player.isDead() && !this.isOnCD()) {
      this.attackPlayer();
    } else {
      this.cooldown -= deltaTime;
    }
  }

  if (!this.player.isDead()) {
    this.skills.forEach(
      function (skill) {
        skill.update(deltaTime);
      }.bind(this)
    );
  }
};

// -------------- RENDER

Mob.prototype.render = function () {
  // surface.ctx.fillStyle = this.fx.color;
  // surface.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  // surface.fillTo(
  //   this.fx.layer,
  //   this.fx.color,
  //   this.pos.x,
  //   this.pos.y,
  //   this.size.x,
  //   this.size.y
  // );

  if (this.isInCombatPos()) {
    this.renderUI();
  }

  this.skills.forEach(function (skill) {
    skill.render();
  });
};

Mob.prototype.renderBody = function () {
  surface.ctx.fillStyle = this.fx.color;
  surface.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};

Mob.prototype.renderSkills = function () {
  this.skills.forEach(function (skill) {
    skill.render();
  });
};

Mob.prototype.renderUI = function () {
  if (this.isInCombatPos()) {
    const ui = UI.mob;
    const x = this.pos.x;
    const height = getScreenScalarY(ui.bar_height);

    var y = this.pos.y + ui.health;
    var width = (this.size.x / this.stats.health) * this.health;
    surface.ctx.fillStyle = ui.healthColor;
    surface.ctx.fillRect(x, y, width, height);

    y = this.pos.y + ui.cooldown;
    width = (this.size.x / this.stats.cooldown) * this.cooldown;
    surface.ctx.fillStyle = ui.cooldownColor;
    surface.ctx.fillRect(x, y, width, height);
  }
};

// -------------- OTHER

Mob.prototype.attackPlayer = function () {
  // randomly chooses a skill
  const index = Math.floor(Math.random() * this.skills.length);
  const skill = this.skills[index];
  // console.log("rand", index, skill);

  skill.cast(this.player);
  this.cooldown = this.stats.cooldown;
};

Mob.prototype.isOnCD = function () {
  return this.cooldown > 0;
};

Mob.prototype.isDead = function () {
  return this.health <= 0;
};

// Returns true if dead AND death anim is completed.
Mob.prototype.isRemovable = function () {
  return this.health <= 0;
};

Mob.prototype.isInCombatPos = function () {
  return this.pos.isEqual(this.targetPos);
};


Mob.prototype.applyEffect = function (stats) {
  const affinity = stats.affinity;
  const damage = stats.damage;
  const weakness = AFFINITIES[this.stats.affinity].weakness;

  console.log(
    this.name,
    " - ",
    "Weakness: " + weakness,
    "Projectile: ",
    affinity
  );

  if (affinity === weakness) {
    this.health -= damage;
    this.cooldown = this.stats.cooldown;
  }

  return this.health <= 0;
};
