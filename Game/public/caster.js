function Caster(image, stats, fx, skills, opponent) {
  this.stats = stats;
  this.opponent = opponent;

  this.health = this.stats.health;
  this.casting = false;
  this.shields = [];
  this.skills = [];
  this.spriteHandler = new SpriteHandler(fx, image);

  skills.forEach(
    function (skillname) {
      const skill = new Skill(skillname, this);

      this.skills.push(skill);
    }.bind(this)
  );
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
  this.spriteHandler.render();

  if (!this.isDead()) {
    this.skills.forEach(function (skill) {
      skill.render();
    });
  }
};

Caster.prototype.renderUI = function () {};

// -------------- STATE

Caster.prototype.isOnTargetPos = function () {
  return this.spriteHandler.isOnTargetPos();
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

Caster.prototype.getCastableSkill = function () {
  var readySkill = null;

  if (this.isReadyToCast()) {
    this.skills.forEach(
      function (skill) {
        if (!skill.isOnCD()) {
          readySkill = skill;
        }
      }.bind(this)
    );
  }

  return readySkill;
};

Caster.prototype.setDestination = function (destination) {
  const coordinates = surface.ratioPosition(destination);

  console.log(this.spriteHandler.pos, coordinates);

  this.spriteHandler.targetPos = coordinates;
};

// -------------- CONDITIONALS

// Caster.prototype.isCastable = function (skill) {
//   return !skill.isOnCD();
// };

// Caster.prototype.isReadyToCast = function () {
//   switch (true) {
//     case this.isDead():
//     case this.opponent.isDead():
//     case !this.isOnTargetPos():
//     case !this.opponent.isInCombatPos():
//       return false;
//     default:
//       return true;
//   }
// };

// Caster.prototype.cast = function (index) {
//   this.casting = true;
//   this.skills[index].cast();
// };

// -------------- STATUS EFFECTS

Caster.prototype.isProtectedFrom = function (skill) {};

Caster.prototype.applyEffect = function (projectile) {
  this.health -= projectile.damage;
};
