function Player(saved, opponent, level) {
  Caster.call(
    this,
    Level.res.player,
    saved.stats,
    PLAYER.fx,
    saved.skills,
    opponent
  );

  this.level = level;
  this.mana = this.stats.mana;
  this.manaRegen = this.stats.mana_regen_sec;
  this.regenDelay = 1;

  this.name = getInLang(PLAYER.name);
  this.containers = PLAYER.fx.containers;
  this.transitionProperty = PLAYER.fx.transition_property;

  this.sequence = "";
  this.historyElement = document.getElementById(this.containers.sequence);
  this.damageElement = document.getElementById(this.containers.damage);
  this.inputContainer = document.getElementById("p_input");
}
Player.prototype = Object.create(Caster.prototype);
Player.prototype.constructor = Player;
Player.debug = true;

// -------------- STATIC

Player.load = function () {
  return loadImage(PLAYER.fx.spritesheet).then(function (image) {
    return image;
  });
};

Player.prototype.save = function (profile) {
  const skillcodes = [];
  this.skills.forEach(function (skill) {
    skillcodes.push(skill.toCode());
  });

  profile.skills = skillcodes;
  saveProfile(profile);
};

// -------------- UPDATE

Player.prototype.update = function (deltaTime) {
  var state = this.spriteHandler.state;

  if (!this.isOnTargetPos() || !this.opponent.isOnTargetPos()) {
    state = STATES.RUN;
  } else if (this.isDead()) {
    state = STATES.DEATH;
  } else {
    state = STATES.IDLE;

    const value = this.level.lastKeyPressed;
    if (value) {
      this.sequence += value;

      if (this.updateSequence(deltaTime, value)) {
        state = STATES.CAST;
      }
    }
  }

  this.updateManaRegen(deltaTime);
  Caster.prototype.update.call(this, deltaTime, state);
};

// -------------- SKILLS

Player.prototype.sequenceIndex = function () {
  return this.sequence.length - 1;
};

Player.prototype.updateSequence = function (deltaTime, value) {
  var valid = false;
  var casted = false;

  this.skills.forEach(
    function (skill) {
      if (skill.validInput(this.sequence)) {
        valid = true;

        if (skill.atEndOfSequence(this.sequence) && this.hasEnoughMana(skill)) {
          casted = true;

          this.mana -= skill.stats.mana;
          skill.createProjectile();
          this.updateUI();
          triggerFlashFX(skill.affinity);
        }
      }
    }.bind(this)
  );

  this.displayInputEffect(value, valid);
  if (!valid || casted) {
    setTimeout(
      function () {
        this.resetInputEffect(!valid || casted);
      }.bind(this),
      500
    );
  }

  return valid;
};

Player.prototype.displayInputEffect = function (value, valid) {
  const glowClass = (valid ? "" : "in") + "valid-glow";

  const historyComp = document.createElement("img");
  const inputComp = document.createElement("img");

  historyComp.src = inputComp.src = document.getElementById(value + "-img").src;
  historyComp.classList.add("spell-fade-in", glowClass);
  this.historyElement.appendChild(historyComp);

  inputComp.classList.add("center", "flash-in-out", glowClass);
  this.inputContainer.appendChild(inputComp);

  setTimeout(function () {
    inputComp.remove();
  }, 500);
};

Player.prototype.resetInputEffect = function () {
  this.historyElement.classList.add("spell-fade-out");

  setTimeout(
    function () {
      this.historyElement.classList.remove("spell-fade-out");
      this.historyElement.textContent = "";
      this.sequence = "";
    }.bind(this),
    1500
  );
};

// -------------- RENDER

Player.prototype.render = function () {
  Caster.prototype.render.call(this);
  this.updateUI();
};

Player.prototype.updateUI = function () {
  Caster.prototype.updateUI.call(this);
  document.getElementById(this.containers.health_text).textContent = Math.floor(
    this.health
  );

  const manaoverlay = document.getElementById(this.containers.mana_overlay);
  const manafill = document.getElementById(this.containers.mana);
  const manavalue = percentage(this.mana, this.stats.mana) + "%";
  manaoverlay.style.height = manavalue;
  manafill.style.height = manavalue;
  document.getElementById(this.containers.mana_text).textContent = Math.floor(
    this.mana
  );
};

// -------------- OTHER

Player.prototype.updateManaRegen = function (deltaTime) {
  this.regenDelay -= deltaTime;

  if (this.regenDelay <= 0) {
    this.regenDelay = 1;
    this.mana = Math.min(this.mana + this.manaRegen, this.stats.mana);
  }
};

Player.prototype.hasEnoughMana = function (skill) {
  if (this.mana >= skill.stats.mana) {
    return true;
  }

  triggerShakeFX(this.containers.mana_container);
  return false;
};

Player.prototype.applyEffect = function (skill) {
  if (Player.debug) {
    this.health = 100;
  }

  Caster.prototype.applyEffect.call(this, skill);
};

// Player.prototype.generateSequence = function () {
//   for (var i = 0; i < this.sequences.length; i++) {
//     const value = getRandomValue(SEQUENCE);

//     this.sequence.push(value);
//   }

//   this.currentIndex = 0;
// };

// Player.prototype.drawcircle = function (pos) {
//   const ctx = surface.layers.effects.ctx;
//   ctx.beginPath();
//   ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
//   ctx.fillStyle = "red";
//   ctx.fill();
//   ctx.stroke();
// };

// Player.prototype.addProjectile = function (skillID) {
//   const ctx = surface.layers.effects.ctx;
//   ctx.beginPath();
//   ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
//   ctx.fillStyle = "red";
//   ctx.fill();
//   ctx.stroke();
// };

// -------------- EFFECTS

// -------------- OLD

// Player.prototype.updateSkills = function (deltaTime) {
//   const inputValue = this.level.lastKeyPressed;
//   var casted = false;

//   this.skills.forEach(
//     function (skill) {
//       skill.update(deltaTime);

//       if (skill.inputSequence(inputValue) && this.hasEnoughMana(skill)) {
//         skill.cast(this.opponent);
//         this.mana -= skill.stats.mana;
//         this.history = [];
//         this.currentIndex = 0;
//         casted = true;

//         this.updateUI();
//         triggerFlashFX(skill.affinity);
//       } else {
//       }
//     }.bind(this)
//   );

//   return casted;
// };
