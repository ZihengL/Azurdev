function Player(level, image, skills) {
  this.level = level;
  this.spritehandler = new SpriteHandler(image, this);

  this.stats = PLAYER.stats;
  this.health = stats.health;
  this.mana = stats.mana;

  this.fx = PLAYER.fx;
  console.log("PLAYER DIMENSIONS", dimensions);


  // this.size = getScreenScalar(fx.width, fx.height);
  // this.pos = getScreenScalar(fx.startX, fx.startY - fx.height);
  // this.targetPos = getScreenScalar(
  //   fx.targetX - fx.width / 2,
  //   fx.targetY - fx.height
  // );

  this.skills = [];
  for (var key in skills) {
    const skill = new Skill(key, this, null);

    this.skills.push(skill);
  }

  this.shield = null;
  this.incomingProjectiles = [];
}

Player.prototype.reset = function () {

}

// -------------- UPDATE

Player.prototype.update = function (deltaTime, inputArcane) {
  console.log(this.pos, this.targetPos);

  if (!this.isInCombatPos()) {
    this.pos.x = Math.min(this.pos.x + PLAYER.fx.speed, this.targetPos.x);
  } else {
    this.skills.forEach(
      function (skill) {
        if (inputArcane && skill.inputSequence(inputArcane)) {
          if (this.level.isMobPresent()) {
            skill.cast(this.level.mobs[0]);
          }
        }

        skill.update(deltaTime);
      }.bind(this)
    );
  }
};

Player.prototype.updateSkills = function (deltaTime, inputArcane) {
  this.skills.forEach(
    function (skill) {
      if (inputArcane && skill.inputSequence(inputArcane)) {
        if (this.level.isMobPresent()) {
          skill.cast(this.level.mobs[0]);
        }
      }

      skill.update(deltaTime);
    }.bind(this)
  );
};

// -------------- RENDER

Player.prototype.render = function () {
  // surface.ctx.fillStyle = PLAYER.fx.color;
  // surface.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  const fx = PLAYER.fx;
  surface.fillTo(fx.layer, fx.color, this.pos.x, this.pos.y, this.size.x, this.size.y);

  // Hud
  const bar_w = PLAYER.fx.bar_width;
  const bar_h = PLAYER.fx.bar_height;

  const hp_w = bar_w * this.health;
  var y = 50;
  surface.ctx.fillStyle = "red";
  surface.ctx.fillRect(centerX(hp_w), y, hp_w, bar_h);

  const mana_w = bar_w * this.mana;
  y += bar_h * 2;
  surface.ctx.fillStyle = "blue";
  surface.ctx.fillRect(centerX(mana_w), y, mana_w, bar_h);

  // Skills
  this.skills.forEach(function (skill, increment) {
    skill.render();
    skill.renderUI(centerX(mana_w) + increment * 50, y + 50);
  });
};

Player.prototype.renderBody = function () {
  surface.ctx.fillStyle = PLAYER.fx.color;
  surface.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};

Player.prototype.renderUI = function () {
  if (this.isInCombatPos()) {
    const bar_w = PLAYER.fx.bar_width;
    const bar_h = PLAYER.fx.bar_height;

    const hp_w = bar_w * this.health;
    var y = 50;
    surface.ctx.fillStyle = "red";
    surface.ctx.fillRect(centerX(hp_w), y, hp_w, bar_h);

    const mana_w = bar_w * this.mana;
    y += bar_h * 2;
    surface.ctx.fillStyle = "blue";
    surface.ctx.fillRect(centerX(mana_w), y, mana_w, bar_h);
  }
};

Player.prototype.renderSkills = function () {
  this.skills.forEach(function (skill, increment) {
    skill.render();
    skill.renderUI(centerX(mana_w) + increment * 50, y + 50);
  });
};

// -------------- OTHER

Player.prototype.applyEffect = function (damage) {
  this.health -= damage;

  return this.health <= 0;
};

Player.prototype.isInCombatPos = function () {
  return this.pos.isEqual(this.targetPos);
};

Player.prototype.isDead = function () {
  return this.health <= 0;
};

// Player.prototype.addSkills = function () {
//   const projectiles = Object.keys(SKILLS);
//   var offsetX = 0;

//   projectiles.forEach(
//     function (config, index) {
//       const skill = new Skill(this, config, index);

//       this.skills.push(skill);
//       offsetX += skill.button.width;
//     }.bind(this)
//   );
// };

// Player.prototype.cast = function (target) {
//   const projectiles = Object.keys(SKILLS);
//   const player = this;
//   var offsetX = 0;

//   projectiles.forEach(function (config, index) {
//     const skill = new Skill(player, config, index);

//     player.skills.push(skill);
//     offsetX += skill.button.width;
//   });
// };

// Player.prototype.renderResources = function () {
//   const bar_w = PLAYER.fx.bar_width;
//   const bar_h = PLAYER.fx.bar_height;

//   const hp_w = bar_w * this.health;
//   var y = 200;
//   surface.ctx.fillStyle = "red";
//   surface.ctx.fillRect(centerX(hp_w), y, hp_w, bar_h);

//   const mana_w = bar_w * this.mana;
//   y += bar_h * 2;
//   surface.ctx.fillStyle = "blue";
//   surface.ctx.fillRect(centerX(mana_w), y, mana_w, bar_h);
// };
