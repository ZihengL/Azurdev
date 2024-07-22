function Player(profile) {
  Caster.call(this, Game.res.player, PLAYER.fx, profile.stats, null);

  this.spells = [];
  profile.spells.forEach(
    function (id) {
      this.spells.push(new Spell(id, this));
    }.bind(this)
  );

  this.mana = profile.stats.mana;
  this.manaRegen = profile.stats.mana_regen_sec;
  this.regenDelay = 1;

  this.sequence = "";
  this.inputLocked = false;
}
Player.prototype = Object.create(Caster.prototype);
Player.prototype.constructor = Player;
Player.debug = true; // PLAYER INVINCIBLE IF TRUE

// -------------- STATIC

Player.load = function () {
  return loadImage(PLAYER.fx.spritesheet).then(function (image) {
    return image;
  });
};

// Player.prototype.save = function (profile) {
//   const spellIds = [];

//   this.spells.forEach(function (spell) {
//     spellIds.push(spell.getID());
//   });
//   profile.spells = spellIds;

//   saveProfile(profile);
// };

// -------------- UPDATE

Player.prototype.update = function (deltaTime, value) {
  var state = this.spriteHandler.state;

  if (!this.isAtTargetPos() || !this.opponent.isAtTargetPos()) {
    state = STATES.RUN;
  } else if (this.isDead()) {
    state = STATES.DEATH;
  } else {
    // TODO: KEEP TO CAST IF NOT AT LAST INDEX OF SPRITE
    state = STATES.IDLE;

    if (value && !this.inputLocked) {
      state = STATES.CAST;
      this.sequence += value;

      const spell = this.checkSequence(value);
      if (spell && spell.isEqualLength(this.sequence)) {
        this.castSpell(spell);
      }
    }
  }

  this.updateManaRegen(deltaTime);
  Caster.prototype.update.call(this, deltaTime, state);
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

// -------------- SPELLS

Player.prototype.sequenceIndex = function () {
  return this.sequence.length - 1;
};

Player.prototype.castSpell = function (spell) {
  if (this.validateManaCost(spell)) {
    Caster.prototype.castSpell.call(this, spell);
    this.mana -= spell.manacost;
  }

  this.resetSequence();
};

Player.prototype.checkSequence = function (value) {
  for (var i = 0; i < this.spells.length; i++) {
    const spell = this.spells[i];
    console.log("Checking spell:", this.sequence, "-", spell.sequence);

    if (spell.validateSequence(this.sequence)) {
      this.sequencingFX(value, true);
      return spell;
    }
  }

  this.sequencingFX(value, false);
  this.resetSequence();
  return null;
};

// const onAnimationEnd = function (element, classes) {
//   classes.forEach(function (classname) {
//     element.classList.remove(classname);
//   });
//   sequenceElem.classList.remove("spell-fade-out");
//   sequenceElem.removeEventListener("animationend", onAnimationEnd);
//   sequenceElem.textContent = inputElem.textContent = "";
// };

Player.prototype.sequencingFX = function (value, valid) {
  const glowEffect = (valid ? "" : "in") + "valid-glow";

  const sequenceImg = this.elements.sequence.children[this.sequenceIndex()];
  const inputElem = this.elements.input;
  sequenceImg.src = inputElem.src = this.elements[value].src;

  sequenceImg.classList.add("spell-fade-in", glowEffect);
  inputElem.classList.add("flash-in-out", glowEffect);

  setTimeout(function () {
    sequenceImg.classList.remove(glowEffect);
    inputElem.classList.remove("flash-in-out", glowEffect);
    inputElem.src = "";
  }, 500);
};

Player.prototype.resetSequence = function () {
  this.sequence = "";
  this.inputLocked = true;
  setTimeout(this.resetSequenceFX(), 500);
};

// SEQUENCEELEM = HTML CONTAINER FOR EACH PLAYER INPUT
// INPUTELEM = BRIEFLY FLASHING ELEMENT
Player.prototype.resetSequenceFX = function () {
  const sequenceElem = this.elements.sequence;

  sequenceElem.classList.add("spell-fade-out");
  setTimeout(
    function () {
      sequenceElem.classList.remove("spell-fade-out");
      for (const child of sequenceElem.children) {
        child.src = "";
      }

      this.inputLocked = false;
    }.bind(this),
    500
  );
};

// -------------- MISC

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

Player.prototype.applyEffect = function (damage) {
  if (Player.debug) {
    this.health = 100;
  }

  Caster.prototype.applyEffect.call(this, damage);
};

// -------------- OLD

// Player.prototype.getAffinityElementByValue = function (value) {
//   return this.elements[value];
// };

// Player.prototype.isCastable = function (spell) {
//   return spell.isEqualLength(this.sequence) && this.validateManaCost(spell);
// };

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
