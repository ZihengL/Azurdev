function createButton(buttonText, onClickFunction) {
  var btn = document.createElement("button"); // Create a new button element
  btn.innerHTML = buttonText; // Set the button text
  btn.onclick = onClickFunction; // Attach the click event handler
  document.getElementById("buttonContainer").appendChild(btn); // Append the button to the container
}

// document.addEventListener('DOMContentLoaded', function() {
//     createButton('Fire', handleButtonClick);
//     createButton('Ice', function() {
//         console.log('A different action for this button.');
//     });
// });

function Player(skills, level) {
  const stats = Object.assign({}, PLAYER.stats);
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

  this.level = level;
}

Player.prototype.update = function (deltaTime, lastKeyPressed) {
  this.skills.forEach(function (skill) {
    if (lastKeyPressed && skill.inputSequence(lastKeyPressed)) {
      const affinity = skill.stats.affinity;
      const target = this.level.getTargetMob(affinity);

      skill.cast(target);
    }

    skill.update(deltaTime);
  });
};

Player.prototype.render = function () {
  surface.ctx.fillStyle = PLAYER.fx.color;
  surface.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

  this.skills.forEach(function (skill) {
    skill.render();
  });
};

Player.prototype.addSkills = function () {
  const projectiles = Object.keys(SKILLS);
  var offsetX = 0;

  projectiles.forEach(
    function (config, index) {
      const skill = new Skill(this, config, index);

      this.skills.push(skill);
      offsetX += skill.button.width;
    }.bind(this)
  );
};

Player.prototype.cast = function (target) {
  const projectiles = Object.keys(SKILLS);
  const player = this;
  var offsetX = 0;

  projectiles.forEach(function (config, index) {
    const skill = new Skill(player, config, index);

    player.skills.push(skill);
    offsetX += skill.button.width;
  });
};

Player.prototype.renderResources = function () {
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


