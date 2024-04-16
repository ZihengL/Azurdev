// BACKGROUNDS: RANDOMLY GENERATED LAYERS
// SPECIAL LEVELS ARE STATICALLY DEFINED, OTHERWISE GENERATED

// GET POINTS FOR KILLING AN ENEMY, SPEND IT ON ELEMENTS/POWERS
// BOOK OF SPELLS
// PLAYER STILL NEEDS TO COUNTER ENEMY TYPE ELEMENT

const level = [
  {
    enemies: 5,
    enemy_types: ["orc_weak", "orc_strong"],
    backgrounds: [],
  },
];

function Level() {

};

Level.prototype.isWon = function () {
    return true;
}