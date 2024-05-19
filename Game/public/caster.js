function Caster(image, stats, fx, skills, opponent, ui, skillEffects) {
  this.stats = stats;
  this.opponent = opponent;

  this.health = this.stats.health;
  this.shield = null;
  this.name = "No name";

  // SKILLS
  this.skills = [];
  skills.forEach(
    function (skillname) {
      const skill = new Skill(skillname, this);

      if (skillEffects) {
        skill.setCastEffect(skillEffects[skill.stats.affinity]);
      }

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
  this.ui = {
    nameplate: Object.assign({}, ui.nameplate),
  };
  this.ui.nameplate.start = surface.ratioPosition(this.ui.nameplate.start);
  for (const key in ui.status_bars) {
    const options = ui.status_bars[key];
    const start = surface.ratioPosition(options.start);
    const end = surface.ratioPosition(options.end);

    this.ui[key] = {
      color: options.color,
      missing: options.missing,
      pos: start,
      size: end.subtract(start),
    };
  }
}

// -------------- UPDATE

Caster.prototype.update = function (deltaTime, state) {
  this.spriteHandler.update(deltaTime, state);
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
    this.skills.forEach(function (skill) {
      skill.render();
    });
  }

  this.spriteHandler.render();

  if (this.isOnTargetPos()) {
    this.renderUI();
  }
};

Caster.prototype.renderUI = function () {
  // this.renderStatusBar(this.ui.health, this.stats.health, this.health);
  // const ctx = surface.layers.ui.ctx;
  // const nameplate = this.ui.nameplate;
  // ctx.font = nameplate.font;
  // ctx.fillStyle = nameplate.fillStyle;
  // ctx.textAlign = nameplate.textAlign;
  // ctx.textBaseline = nameplate.textBaseline;
  // ctx.fillText(this.name, nameplate.start.x, nameplate.start.y);
  //   ctx.save();
  //   for (const key in nameplate) {
  //     const value = nameplate[key];
  //     if (ctx[key]) {
  //       ctx[key] = value;
  //     }
  //   }
  //   ctx.fillText(this.name, nameplate.start.x, nameplate.start.y);
  //   ctx.restore();
  // };
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

Caster.prototype.isOnTargetPos = function () {
  return this.spriteHandler.isOnTargetPos();
};

Caster.prototype.isAtPos = function (pos) {
  return this.spriteHandler.pos.isEqual(pos);
};

Caster.prototype.isAtCombatPos = function () {
  return this.isAtPos(this.positions.combat);
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

Caster.prototype.setDestination = function (destination) {
  const coordinates = surface.ratioPosition(destination);

  this.spriteHandler.targetPos = coordinates;
};

// -------------- CONDITIONALS

// -------------- STATUS EFFECTS

Caster.prototype.isProtectedFrom = function (skill) {};

Caster.prototype.applyEffect = function (projectile) {
  this.health -= projectile.damage;
};
