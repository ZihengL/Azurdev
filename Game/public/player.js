function Player(saved, opponent, level) {
  Caster.call(
    this,
    Level.res.player.sprite,
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

  this.sequenceRes = Level.res.player.sequence;
  this.generateSequence();
}
Player.prototype = Object.create(Caster.prototype);
Player.prototype.constructor = Player;

// -------------- STATIC

// Player.load = function () {
//   const res = {
//     sequence: {},
//   };
//   var loadSequence = Promise.resolve();

//   loadImage(PLAYER.fx.spritesheet).then(function (image) {
//     res.sprite = image;

//     for (const key in SEQUENCE.images) {
//       const subpaths = SEQUENCE.images[key];

//       res.sequence[key] = [];
//       for (var i = 0; i < subpaths.length; i++) {
//         const path = SEQUENCE.path + subpaths[i];

//         loadSequence = loadSequence.then(function () {
//           return loadImage(path).then(function (image) {
//             res.sequence[key].push(image);
//             console.log(key, res.sequence[key])
//           });
//         });
//       }
//     }
//   });

//   return loadSequence.then(function () {
//     return res;
//   });

//   // const res = {};

//   // return Promise.all([
//   //   loadImage(PLAYER.fx.spritesheet),
//   //   loadImage(SEQUENCE.path)
//   // ]).then(function (images) {
//   //   res.sprite = images[0];
//   //   res.sequence = images[1];
//   //   return res;
//   // });

//   // return loadImage(PLAYER.fx.spritesheet).then(function (image) {
//   //   return image;
//   // });
// };

Player.load = function () {
  const res = {
    sequence: {},
  };

  return loadImage(PLAYER.fx.spritesheet).then(function (image) {
    res.sprite = image;

    let sequencePromise = Promise.resolve();

    for (const key in SEQUENCE.images) {
      const subpaths = SEQUENCE.images[key];
      res.sequence[key] = [];

      subpaths.forEach((subpath, i) => {
        const path = SEQUENCE.path + subpath;

        sequencePromise = sequencePromise.then(() => {
          return loadImage(path).then((image) => {
            res.sequence[key][i] = image;
          });
        });
      });
    }

    return sequencePromise.then(() => res);
  });
};

// -------------- UPDATE

Player.prototype.update = function (deltaTime, value) {
  var state = this.spriteHandler.state;

  if (this.isDead()) {
    state = STATES.DEATH;
    this.updateUIVisibility(true);
  } else if (!this.isOnTargetPos() || !this.opponent.isOnTargetPos()) {
    state = STATES.RUN;
    this.updateUIVisibility(true);
  } else if (this.opponent.isAttacking()) {
    state = STATES.IDLE;
  } else if (this.isAttacking()) {
    state = STATES.CAST;
    this.skill.update(deltaTime);

    if (!this.isAttacking() && !this.opponent.isDead()) {
      this.generateSequence();
    }
  } else {
    this.updateUIVisibility(false);

    if (value) {
      if (this.checkSequence(value) && this.isSequenceComplete()) {
        state = STATES.CAST;
        this.cast();
      }
    }
  }

  this.spriteHandler.update(deltaTime, state);
};

// -------------- SEQUENCING

Player.prototype.cast = function () {
  Caster.prototype.cast.call(this);
};

Player.prototype.generateSequence = function () {
  const sequenceContainer = document.getElementById(SEQUENCE.div);
  this.sequence = {
    length: this.level.sequences.length,
  };
  this.currentIndex = 0;

  sequenceContainer.textContent = "";
  for (var i = 0; i < this.sequence.length; i++) {
    const value = getRandomValue(SEQUENCE.values);
    const element = document.createElement("img");

    element.id = SEQUENCE.id + i;
    element.class = SEQUENCE.class;
    this.sequence[i] = {
      value: value,
      element: element,
    };
    this.setElementState(i, SEQUENCE.states.INACTIVE);
    sequenceContainer.appendChild(element);
  }

  console.log("NEW SEQUENCE", this.sequence);
};

Player.prototype.restartSequence = function () {
  this.currentIndex = 0;

  for (var i = 0; i < this.sequence.length; i++) {
    const obj = this.sequence[i];
    // const element = this.getSequenceElement(i);

    obj.element.class = SEQUENCE.states.INACTIVE;
    obj.element.src = this.getSequenceSrc(obj.value, SEQUENCE.states.INACTIVE);
  }
};

Player.prototype.getSequenceSrc = function (value, state) {
  return this.sequenceRes[value][state].src;
};

Player.prototype.checkSequence = function (value) {
  const currentValue = this.sequence[this.currentIndex].value;
  const valueMatch = value === currentValue;

  if (valueMatch) {
    this.setElementState(this.currentIndex, SEQUENCE.states.ACTIVE);
    this.currentIndex++;
  } else {
    this.restartSequence();
  }

  return valueMatch;
};

Player.prototype.isSequenceComplete = function () {
  return this.currentIndex >= this.sequence.length;
};

Player.prototype.getSequenceElement = function (index) {
  return this.sequence[index].element;
};

Player.prototype.setElementState = function (index, state) {
  const element = this.sequence[index].element;

  element.src = this.getSequenceSrc(this.sequence[index].value, state);
};

// -------------- RENDER

Player.prototype.updateSkills = function (deltaTime) {
  this.skill.update(deltaTime);

  if (!this.isAttacking()) {
    this.generateSequence();
    // if (!this.opponent.isDead()) {
    //   this.generateSequence();
    // }
  }
};

Player.prototype.render = function () {
  this.spriteHandler.render();

  if (!this.isDead()) {
    this.skill.render();
    // this.skills.forEach(function (skill) {
    //   skill.render();
    //   skill.renderCastEffect();
    // });
  }

  this.updateUI();
};

Player.prototype.updateUI = function () {
  Caster.prototype.updateUI.call(this);
  document.getElementById(this.containers.health_text).textContent =
    this.health;
};

Player.prototype.updateUIVisibility = function (toHidden) {
  if (this.hiddenUI !== toHidden) {
    this.hiddenUI = toHidden;
    setHidden(SEQUENCE.div, this.hiddenUI);
  }
};

// -------------- OTHER

Player.prototype.applyEffect = function (projectile) {
  Caster.prototype.applyEffect.call(this, projectile);

  if (!this.isDead()) {
    this.generateSequence();
  }
};

Player.prototype.isInStandby = function () {
  return this.sequenceIdx < 0;
};

// -------------- OLD

Player.prototype.hasEnoughMana = function (skill) {
  if (this.mana >= skill.stats.mana_cost) {
    return true;
  }

  triggerShakeFX(this.containers.mana_container);
  return false;
};

Player.prototype.updateSkills = function (deltaTime) {
  const inputValue = this.level.lastKeyPressed;
  var casted = false;
  var highest = 0;
  var index = null;

  this.skills.forEach(
    function (skill, idx) {
      skill.update(deltaTime);

      if (skill.inputSequence(inputValue) && this.hasEnoughMana(skill)) {
        skill.cast(this.opponent);
        this.mana -= skill.stats.mana_cost;
        this.history = [];
        this.currentIndex = 0;
        casted = true;

        this.updateUI();
        triggerFlashFX(skill.stats.affinity);
      } else {
        if (skill.sequenceIdx > highest) {
          highest = skill.sequenceIdx;
          index = idx;
        }
      }
    }.bind(this)
  );

  return casted;
};

// Player.prototype.updateUI = function () {
//   Caster.prototype.updateUI.call(this);
//   document.getElementById(this.containers.health_text).textContent =
//     this.health;

// const manaoverlay = document.getElementById(this.containers.mana_overlay);
// const manafill = document.getElementById(this.containers.mana);
// const manavalue = percentage(this.mana, this.stats.mana) + "%";
// manaoverlay.style.height = manavalue;
// manafill.style.height = manavalue;
// document.getElementById(this.containers.mana_text).textContent = this.mana;
// };

// Player.prototype.update = function (deltaTime) {
//   var state = this.spriteHandler.state;

//   if (!this.isOnTargetPos() || !this.opponent.isOnTargetPos()) {
//     state = STATES.RUN;
//   } else if (this.isDead()) {
//     state = STATES.DEATH;
//   } else {
//     if (this.updateSkills(deltaTime)) {
//       state = STATES.CAST;
//     } else {
//       state = STATES.IDLE;
//     }
//   }

//   this.regenDelay -= deltaTime;
//   if (this.regenDelay <= 0) {
//     this.regenDelay = 1;
//     this.mana = Math.min(this.mana + this.manaRegen, this.stats.mana);
//   }

//   this.spriteHandler.update(deltaTime, state);
// };
