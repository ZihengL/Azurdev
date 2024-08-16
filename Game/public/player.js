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

// -------------- STATIC

Player.load = function () {
  return loadImage(PLAYER.fx.spritesheet).then(function (image) {
    return image;
  });
};

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
      this.sequencingFX(value);

      const spell = this.checkSequence(value);
      if (!spell) {
        this.resetSequence();
      } else {
        if (spell.isEqualLength(this.sequence)) {
          this.castSpell(spell);
        }
      }

      // if (spell && spell.isEqualLength(this.sequence)) {
      //   this.castSpell(spell);
      // }
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
  // var animation = "sequence-out";

  if (this.validateManaCost(spell)) {
    // animation = "runecast-" + spell.sequence.length;
    this.mana -= spell.manacost;
    this.elements.spell_icon.src = spell.affinityIcon.src;
    this.resetSequence(spell);

    Caster.prototype.castSpell.call(this, spell);
  } else {
    this.resetSequence();
  }
};

Player.prototype.checkSequence = function (value) {
  console.log("SEQUENCE", this.sequence);
  for (const spell of this.spells) {
    console.log(spell.name, spell.sequence);

    if (spell.validateSequence(this.sequence)) {
      // this.sequencingFX(value, true);
      return spell;
    }
  }

  // this.sequencingFX(value, false);
  setTimeout(this.resetSequence, 500);
  return null;
};

Player.prototype.sequencingFX = function (value, valid) {
  const sequenceImage = new Image();
  const inputImage = new Image();
  const buttons = this.elements.buttons.children;

  sequenceImage.src = inputImage.src = buttons[value - 1].src;
  sequenceImage.classList.add("sequence-in");

  this.elements.sequence.append(sequenceImage);
  this.elements.input.append(inputImage);
};

Player.prototype.resetSequence = function (spell) {
  var seqAnim, iconImg;
  if (spell) {
    seqAnim = "runecast-" + spell.sequence.length;
    iconImg = spell.icon;
  } else {
    seqAnim = "sequence-out";
    iconImg = document.getElementById("spell_fail");
  }

  const sequence = this.elements.sequence;
  const buttons = this.elements.buttons;
  const icon = this.elements.spell_icon;
  const onTimeout = function () {
    // sequence.classList.remove(animation);
    buttons.classList.remove("grayscale-overlay");
    sequence.classList.remove(seqAnim);
    iconImg.remove();

    sequence.innerHTML = this.elements.input.innerHTML = "";
    this.inputLocked = false;
  }.bind(this);

  this.sequence = "";
  this.inputLocked = true;

  buttons.classList.add("grayscale-overlay");
  sequence.classList.add(seqAnim);
  icon.appendChild(iconImg);
  console.log(iconImg, icon);
  // icon.classList.add("spellcast");

  setTimeout(onTimeout, 2000);
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
    triggerFX(this.elements.mana_container, "shake", 500);
    return false;
  }

  return true;
};

Player.prototype.applyEffect = function (damage) {
  if (PLAYER_DEBUG) {
    this.health = 100;
  }

  Caster.prototype.applyEffect.call(this, damage);
};

// -------------- OLD

// Player.prototype.resetSequenceFX = function () {
//   const sequence = this.elements.sequence;

//   sequence.classList.add("child-spell-fade-out");
//   setTimeout(
//     function () {
//       sequence.classList.remove("child-spell-fade-out");
//       sequence.innerHTML = this.elements.input.innerHTML = "";

//       this.inputLocked = false;
//     }.bind(this),
//     1000
//   );
// };

// const onAnimationEnd = function (element, classes) {
//   classes.forEach(function (classname) {
//     element.classList.remove(classname);
//   });
//   sequenceElem.classList.remove("spell-fade-out");
//   sequenceElem.removeEventListener("animationend", onAnimationEnd);
//   sequenceElem.textContent = inputElem.textContent = "";
// };

// Player.prototype.save = function (profile) {
//   const spellIds = [];

//   this.spells.forEach(function (spell) {
//     spellIds.push(spell.getID());
//   });
//   profile.spells = spellIds;

//   saveProfile(profile);
// };

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
