function Caster(image, stats, fx, skills, opponent, ui, skillEffects) {
  this.stats = stats;
  this.opponent = opponent;

  this.health = this.stats.health;
  this.shield = null;
  this.name = "";
  this.skill = new Skill(Object.keys(SKILLS)[0], this);

  // SKILLS
  this.skills = [];
  skills.forEach(
    function (skillname) {
      const skill = new Skill(skillname, this);

      this.skills.push(skill);
    }.bind(this)
  );

  // POSITIONS
  this.positions = {
    start: surface.ratioPosition(fx.position.start),
    combat: surface.ratioPosition(fx.position.combat),
    end: surface.ratioPosition(fx.position.end),
  };

  this.spriteHandler = new SpriteHandler(
    fx,
    image,
    this.positions.start,
    this.positions.combat
  );

  // UI
  // this.ui = {
  //   nameplate: Object.assign({}, ui.nameplate),
  // };
  // this.ui.nameplate.start = surface.ratioPosition(this.ui.nameplate.start);
  // for (const key in ui.status_bars) {
  //   const options = ui.status_bars[key];
  //   const start = surface.ratioPosition(options.start);
  //   const end = surface.ratioPosition(options.end);

  //   this.ui[key] = {
  //     color: options.color,
  //     missing: options.missing,
  //     pos: start,
  //     size: end.subtract(start),
  //   };
  // }

  this.shadow = false;
}

// -------------- UPDATE

Caster.prototype.update = function (deltaTime, state) {
  if (this.isDead()) {
    state = STATES.DEATH;
  }

  this.spriteHandler.update(deltaTime, state);
  this.skill.update(deltaTime);
};

Caster.prototype.updatePosition = function () {
  this.spriteHandler.updatePosition();
};

Caster.prototype.updateSkills = function (deltaTime) {
  this.skills.forEach(
    function (skill) {
      skill.update(deltaTime);
    }.bind(this)
  );
};

// -------------- RENDER

Caster.prototype.render = function () {
  if (!this.isDead()) {
    this.skill.render();
    // this.skills.forEach(function (skill) {
    //   skill.render();
    // });
  }

  this.spriteHandler.render();

  if (this.isOnTargetPos()) {
    this.updateUI();
  }
};

Caster.prototype.updateUI = function () {
  const hpoverlay = document.getElementById(this.containers.health_overlay);
  const hpfill = document.getElementById(this.containers.health);
  const hpvalue = percentage(this.health, this.stats.health) + "%";
  hpoverlay.style[this.transitionProperty] = hpvalue;
  hpfill.style[this.transitionProperty] = hpvalue;
};

Caster.prototype.renderStatusBar = function (options, max, remaining) {
  surface.fillVectorToUI(options.missing, options.pos, options.size);

  if (remaining > 0) {
    const unit = options.size.x / max;
    const size = options.size.copy();
    const position = options.pos.copy();

    size.x = remaining * unit;
    if (position.x > surface.centerX()) {
      position.x += (max - remaining) * unit;
    }

    surface.fillVectorToUI(options.color, position, size);
  }
};

// -------------- STATE

Caster.prototype.isOutOfCombat = function () {
  return (
    !this.isInCombatPos() ||
    this.opponent.isDead() ||
    this.opponent.isAttacking()
  );
};

Caster.prototype.isOnTargetPos = function () {
  return this.spriteHandler.isOnTargetPos();
};

Caster.prototype.isAtPos = function (pos) {
  return this.spriteHandler.pos.isEqual(pos);
};

Caster.prototype.isMovingTo = function (pos) {
  return this.spriteHandler.targetPos.isEqual(pos);
};

Caster.prototype.isInCombatPos = function () {
  return (
    this.isAtPos(this.positions.combat) &&
    this.isMovingTo(this.positions.combat)
  );
};

Caster.prototype.isAtEndPos = function () {
  return this.isAtPos(this.positions.end);
};

Caster.prototype.isMovingToEndPos = function () {
  return this.spriteHandler.targetPos.isEqual(this.positions.end);
};

Caster.prototype.isCasting = function () {
  return this.spriteHandler.isAtEndofAnim(STATES.CAST);
};

Caster.prototype.isAttacking = function () {
  return this.skill.projectiles.length > 0;
};

Caster.prototype.isCombatReady = function () {
  return !this.isDead() && this.isInCombatPos() && !this.isAttacking();
};

Caster.prototype.isDead = function () {
  return this.health <= 0;
};

// -------------- GETTERS

Caster.prototype.getState = function () {
  return this.spriteHandler.state;
};

Caster.prototype.bodyCenter = function () {
  return this.spriteHandler.bodyCenter();
};

Caster.prototype.setDestination = function (coordinates) {
  this.spriteHandler.targetPos = coordinates;
};

// -------------- CONDITIONALS

// -------------- STATUS EFFECTS

Caster.prototype.cast = function () {
  this.skill.cast(this.opponent);
};

Caster.prototype.applyEffect = function (projectile) {
  this.health -= projectile.damage;
  this.spriteHandler.shadow = true;

  if (!this.isDead()) {
    const self = this;
    setTimeout(function () {
      self.spriteHandler.shadow = false;
    }, 50);
  }

  triggerShakeFX(
    this.containers.health_container,
    this.health - this.stats.health
  );
};