function Caster(image, stats, fx, skillIDs, opponent) {
  this.stats = stats;
  this.opponent = opponent;

  this.health = this.stats.health;
  this.shield = null;
  this.name = "";

  // SKILLS
  this.skills = [];
  skillIDs.forEach(
    function (id) {
      this.skills.push(Skill.codeToInstance(id, this));
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

  this.projectiles = [];
}

// -------------- UPDATE

Caster.prototype.update = function (deltaTime, state) {
  this.spriteHandler.update(deltaTime, state);

  this.projectiles = this.projectiles.filter(function (projectile) {
    return !projectile.update(deltaTime);
  });
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
  this.spriteHandler.render();

  this.projectiles.forEach(function (projectile) {
    projectile.render();
  });
};

Caster.prototype.updateUI = function () {
  const hpoverlay = document.getElementById(this.containers.health_overlay);
  const hpfill = document.getElementById(this.containers.health);
  const hpvalue = percentage(this.health, this.stats.health) + "%";
  hpoverlay.style[this.transitionProperty] = hpvalue;
  hpfill.style[this.transitionProperty] = hpvalue;
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

Caster.prototype.applyEffect = function (damage) {
  this.health = Math.max(this.health - damage, 0);
  this.triggerDamageEffects(damage);
};

Caster.prototype.triggerDamageEffects = function (damage) {
  const pos = this.bodyCenter();
  this.damageElement.innerText = damage;
  this.damageElement.style.left = pos.x + "px";
  this.damageElement.style.top = pos.y + "px";

  triggerFX(this.damageElement, "dmg-fade");
  triggerShakeFX(this.containers.health_container);
  this.spriteHandler.triggerDamageGlow(this.isDead());
};

// -------------- STATE

Caster.prototype.isOnTargetPos = function () {
  return this.spriteHandler.isOnTargetPos();
};

Caster.prototype.isAtPos = function (pos) {
  return this.spriteHandler.pos.isEqual(pos);
};

Caster.prototype.isInCombatPos = function () {
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

Caster.prototype.isAttacking = function () {
  return this.projectiles.length > 0;
};

Caster.prototype.isDead = function () {
  return this.health <= 0;
};

// -------------- EFFECTS
