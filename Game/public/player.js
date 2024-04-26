function Player(level, skills) {
  this.level = level;

  const stats = PLAYER.stats;
  this.health = stats.health;
  this.mana = stats.mana;

  this.skills = [];
  for (var key in skills) {
    const skill = new Skill(key, this, null);

    this.skills.push(skill);
  }

  const fx = PLAYER.fx;
  this.pos = fx.position;
  this.size = fx.size;
}

// -------------- UPDATE & RENDER

Player.prototype.update = function (deltaTime, inputArcane) {
  this.skills.forEach(
    function (skill) {
      if (inputArcane && skill.inputSequence(inputArcane)) {
        if (this.level.isMobPresent()) {
          skill.cast(this.level.mobs);
        }
      }

      skill.update(deltaTime);
    }.bind(this)
  );
};

Player.prototype.render = function () {
  surface.ctx.fillStyle = PLAYER.fx.color;
  surface.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

  const bar_w = PLAYER.fx.bar_width;
  const bar_h = PLAYER.fx.bar_height;

  const hp_w = bar_w * this.health;
  var y = 200;
  surface.ctx.fillStyle = "red";
  surface.ctx.fillRect(centerX(hp_w), y, hp_w, bar_h);

  const mana_w = bar_w * this.mana;
  y += bar_h * 2;
  surface.ctx.fillStyle = "blue";
  surface.ctx.fillRect(centerX(mana_w), y, mana_w, bar_h);

  this.skills.forEach(function (skill, increment) {
    skill.render();
    skill.renderUI(centerX(mana_w) + increment * 150);
  });
};

Player.prototype.renderUI = function () {
  const bar_w = PLAYER.fx.bar_width;
  const bar_h = PLAYER.fx.bar_height;

  const hp_w = bar_w * this.health;
  var y = 200;
  surface.ctx.fillStyle = "red";
  surface.ctx.fillRect(centerX(hp_w), y, hp_w, bar_h);

  const mana_w = bar_w * this.mana;
  y += bar_h * 2;
  surface.ctx.fillStyle = "blue";
  surface.ctx.fillRect(centerX(mana_w), y, mana_w, bar_h);
};

// -------------- OTHER

Player.prototype.applyEffect = function (damage) {
  this.health -= damage;

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
