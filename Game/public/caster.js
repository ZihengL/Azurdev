function Caster(image, fx, stats, opponent) {
  this.stats = stats;
  this.opponent = opponent;

  this.health = stats.health;
  this.projectiles = [];

  // POSITIONS
  const surface = Surface.instance;
  this.positions = {
    start: surface.ratioPosition(fx.position.start),
    combat: surface.ratioPosition(fx.position.combat),
    end: surface.ratioPosition(fx.position.end),
  };

  // SPRITES
  this.spriteHandler = new SpriteHandler(
    image,
    fx,
    this.positions.start,
    this.positions.combat
  );

  // HTML UI ELEMENTS
  this.elements = [];
  for (const key in fx.elements) {
    const id = fx.elements[key];

    this.elements[key] = document.getElementById(id);
  }
}

// -------------- UPDATE

Caster.prototype.update = function (deltaTime, state) {
  this.spriteHandler.update(deltaTime, state);

  this.projectiles = this.projectiles.filter(
    function (projectile) {
      if (projectile.update(deltaTime)) {
        this.opponent.applyEffect(projectile.damage, projectile.affinity);

        return false;
      }

      return true;
    }.bind(this)
  );
};

Caster.prototype.updatePosition = function () {
  this.spriteHandler.updatePosition();
};

// -------------- RENDER

Caster.prototype.render = function () {
  this.spriteHandler.render(this.isDead());

  this.projectiles.forEach(function (projectile) {
    projectile.render();
  });
};

Caster.prototype.updateUI = function (axis) {
  const healthValue = percentage(this.health, this.stats.health) + "%";
  this.elements.health_overlay.style[axis] = this.elements.health.style[axis] =
    healthValue;
};

// -------------- GETTERS / SETTERS

Caster.prototype.getState = function () {
  return this.spriteHandler.state;
};

Caster.prototype.getBodyCenter = function () {
  return this.spriteHandler.bodyCenter();
};

Caster.prototype.setTargetPosition = function (targetPos) {
  if (targetPos) {
    this.spriteHandler.targetPos = targetPos;
  }
};

// -------------- STATUS EFFECTS

Caster.prototype.castSpell = function (spell) {
  const projectile = spell.createProjectile(
    this.getBodyCenter(),
    this.opponent.getBodyCenter()
  );

  this.projectiles.push(projectile);
};

Caster.prototype.applyEffect = function (damage) {
  this.health = Math.max(this.health - damage, 0);
  this.triggerDamageEffects(damage);
};

Caster.prototype.triggerDamageEffects = function (damage) {
  const dmgElement = this.elements.damage;
  const pos = this.getBodyCenter();

  dmgElement.innerText = damage;
  dmgElement.style.left = pos.x + "px";
  dmgElement.style.top = pos.y + "px";
  triggerFX(dmgElement, "dmg-fade", 750);
  triggerFX(this.elements.health_container, "shake", 500);
  this.spriteHandler.triggerDamageGlow(this.isDead());
};

Caster.prototype.hasNoProjectiles = function () {
  return this.projectiles.length === 0;
};

Caster.prototype.showMessage = function (message) {
  // TODO: CONTAINER DISPLAYING MESSAGE FOR TIME
};

// -------------- MISC

Caster.prototype.isAtTargetPos = function () {
  return this.spriteHandler.isAtTargetPos();
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
