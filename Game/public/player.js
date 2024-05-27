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
  this.historyContainer = document.getElementById(this.containers.sequence);
  this.damageContainer = document.getElementById(this.containers.damage);
  console.log(this.damageContainer);
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
    const value = this.level.lastKeyPressed;

    if (value) {
      if (this.checkSkills(deltaTime, value)) {
        state = STATES.CAST;
      } else {
        state = STATES.IDLE;
      }
    } else {
      this.skills.forEach(function (skill) {
        skill.update(deltaTime);
      });
    }
  }

  this.regenDelay -= deltaTime;
  if (this.regenDelay <= 0) {
    this.regenDelay = 1;
    this.mana = Math.min(this.mana + this.manaRegen, this.stats.mana);
  }

  this.spriteHandler.update(deltaTime, state);
};

Player.prototype.checkSkills = function (deltaTime, value) {
  var validInput = false;
  var casted = false;

  this.sequence += value;
  this.skills.forEach(
    function (skill) {
      if (skill.validInput(this.sequence)) {
        validInput = true;

        if (skill.atEndOfSequence(this.sequence) && this.hasEnoughMana(skill)) {
          casted = true;

          this.mana -= skill.stats.mana;
          skill.cast(this.opponent);
          this.updateUI();
          triggerFlashFX(skill.affinity);
        }
      }

      skill.update(deltaTime);
    }.bind(this)
  );

  const element = document.createElement("img");
  element.src = document.getElementById(value + "-img").src;
  this.historyContainer.appendChild(element);
  element.classList.add("fade-in");

  if (!validInput || casted) {
    const self = this;
    this.historyContainer.classList.add("fade-out");

    setTimeout(function () {
      self.historyContainer.classList.remove("fade-out");
      self.historyContainer.textContent = "";
      self.sequence = "";
    }, 500);
  }

  return validInput;
};

Player.prototype.updateSkills = function (deltaTime) {
  const inputValue = this.level.lastKeyPressed;
  var casted = false;

  this.skills.forEach(
    function (skill) {
      skill.update(deltaTime);

      if (skill.inputSequence(inputValue) && this.hasEnoughMana(skill)) {
        skill.cast(this.opponent);
        this.mana -= skill.stats.mana;
        this.history = [];
        this.currentIndex = 0;
        casted = true;

        this.updateUI();
        triggerFlashFX(skill.affinity);
      } else {
      }
    }.bind(this)
  );

  return casted;
};

// -------------- RENDER

Player.prototype.render = function () {
  this.spriteHandler.render();

  if (!this.isDead()) {
    this.skills.forEach(function (skill) {
      skill.render();
      skill.renderCastEffect();
    });
  }

  this.updateUI();
};

Player.prototype.updateUI = function () {
  Caster.prototype.updateUI.call(this);
  document.getElementById(this.containers.health_text).textContent =
    this.health;

  const manaoverlay = document.getElementById(this.containers.mana_overlay);
  const manafill = document.getElementById(this.containers.mana);
  const manavalue = percentage(this.mana, this.stats.mana) + "%";
  manaoverlay.style.height = manavalue;
  manafill.style.height = manavalue;
  document.getElementById(this.containers.mana_text).textContent = this.mana;
};

// -------------- OTHER

Player.prototype.cancelSequence = function () {};

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

Player.prototype.generateSequence = function () {
  for (var i = 0; i < this.sequences.length; i++) {
    const value = getRandomValue(SEQUENCE);

    this.sequence.push(value);
  }

  this.currentIndex = 0;
};
