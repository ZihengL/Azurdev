function Player(saved, opponent) {
  Caster.call(
    this,
    Game.res.player,
    saved.stats,
    PLAYER.fx,
    saved.spell_ids,
    opponent
  );

  this.mana = this.stats.mana;
  this.manaRegen = this.stats.mana_regen_sec;
  this.regenDelay = 1;

  this.sequence = "";
  this.inputLocked = false;
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
  const spellIds = [];

  this.spells.forEach(function (spell) {
    spellIds.push(spell.getID());
  });
  profile.spell_ids = spellIds;

  saveProfile(profile);
};

// -------------- UPDATE

Player.prototype.update = function (deltaTime, value) {
  var state = this.spriteHandler.state;

  if (!this.isOnTargetPos() || !this.opponent.isOnTargetPos()) {
    state = STATES.RUN;
  } else if (this.isDead()) {
    state = STATES.DEATH;
  } else {
    // TODO: KEEP TO CAST IF
    state = STATES.IDLE;

    if (value && !this.inputLocked) {
      state = STATES.CAST;

      const spell = this.checkSequence(value);
      if (spell && this.isCastable(spell)) {
        this.castSpell(spell);
      }
    }
  }

  this.updateManaRegen(deltaTime);
  Caster.prototype.update.call(this, deltaTime, state);
};

// -------------- SPELLS

Player.prototype.sequenceIndex = function () {
  return this.sequence.length - 1;
};

Player.prototype.castSpell = function (spell) {
  Caster.prototype.castSpell.call(this, spell);

  this.mana -= spell.manacost;
  this.resetSequence();
};

Player.prototype.checkSequence = function (value) {
  this.sequence += value;
  for (var i = 0; i < this.spells.length; i++) {
    const spell = this.spells[i];

    if (spell.validateSequence(this.sequence)) {
      this.addToSequenceEffect(value, true);
      return spell;
    }
  }

  this.addToSequenceEffect(value, false);
  this.resetSequence();
  return null;
};

Player.prototype.resetSequence = function () {
  this.inputLocked = true;
  this.sequence = "";

  setTimeout(
    function () {
      this.inputLocked = false;
      this.resetSequenceEffect();
    }.bind(this),
    500
  );
};

Player.prototype.resetSequenceEffect = function () {
  const sequenceElement = this.elements.sequence;
  const inputElement = this.elements.input;

  sequenceElement.classList.add("spell-fade-out");
  setTimeout(function () {
    sequenceElement.classList.remove("spell-fade-out");
    sequenceElement.textContent = inputElement.textContent = "";
  }, 1500);
};

Player.prototype.addToSequenceEffect = function (value, valid) {
  const validityEffect = (valid ? "" : "in") + "valid-glow";
  const sequenceSub = document.createElement("img");
  const inputSub = document.createElement("img");

  sequenceSub.src = inputSub.src = this.elements[value].src;

  sequenceSub.classList.add("spell-fade-in", validityEffect);
  this.elements.sequence.appendChild(sequenceSub);

  inputSub.classList.add("center", "flash-in-out", validityEffect);
  this.elements.input.appendChild(inputSub);
};

// -------------- RENDER

Player.prototype.render = function () {
  Caster.prototype.render.call(this);
  this.updateUI();
};

Player.prototype.updateUI = function () {
  Caster.prototype.updateUI.call(this, "height");
  this.elements.health_text.textContent = Math.floor(this.health);

  const manavalue = percentage(this.mana, this.stats.mana) + "%";
  this.elements.mana_overlay.style.height = this.elements.mana.style.height =
    manavalue;
  this.elements.mana_text.textContent = Math.floor(this.mana);
};

// -------------- MISC

Player.prototype.getAffinityElementByValue = function (value) {
  return this.elements[value];
};

Player.prototype.updateManaRegen = function (deltaTime) {
  this.regenDelay -= deltaTime;

  if (this.regenDelay <= 0) {
    this.regenDelay = 1;
    this.mana = Math.min(this.mana + this.manaRegen, this.stats.mana);
  }
};

Player.prototype.validateManaCost = function (spell) {
  if (this.mana < spell.manacost) {
    triggerShakeFX(this.elements.mana_container);
    return false;
  }

  return true;
};

Player.prototype.isCastable = function (spell) {
  return spell.isEqualLength(this.sequence) && this.validateManaCost(spell);
};

Player.prototype.applyEffect = function (damage) {
  if (Player.debug) {
    this.health = 100;
  }

  Caster.prototype.applyEffect.call(this, damage);
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
