function loadImage(src) {
  return new Promise(function (resolve, reject) {
    var image = new Image();

    image.onload = function () {
      resolve(image);
    };
    image.onerror = function () {
      reject(new Error("Failed to load image: " + src));
    };
    image.src = src;
  });
}

function isEmpty(obj) {
  return JSON.stringify(obj) === "{}";
}

function getRandom(max, min) {
  min = min || 0;

  if (max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  return Math.floor(Math.random() + min);
}

function getRandomValue(array) {
  const index = getRandom(array.length);

  return array[index];
}

// -------------- PROFILES

function saveProfile(data) {
  console.log("Saving profile", data);

  local_storage_lib.branch(LOCALSTORAGE.key, data);
}

function loadProfile() {
  const saved = local_storage_lib.branch(LOCALSTORAGE.key);

  if (isEmpty(saved)) {
    saveProfile(LOCALSTORAGE.defaults);

    return loadProfile();
  }

  console.log("Loading profile", saved);
  return saved;
}

function newProfile() {
  console.log("New profile");
  saveProfile(LOCALSTORAGE.defaults);

  return loadProfile();
}

function isWithinPlayerProgress(level) {
  const max = Game.instance.profile.level_progress;

  return level <= max;
}

// -------------- MATH

function percentage(amount, max) {
  return (amount / max) * 100;
}

// -------------- MENUS

function changeLanguage() {
  lang = lang === 2 ? 1 : 2;

  console.log("Switching language to", lang);

  for (const key in DISPLAY.elements) {
    const subkeys = DISPLAY.elements[key];
    const container = document.getElementById(key);

    if (container) {
      for (const subkey in subkeys) {
        const values = subkeys[subkey];
        const element = getFromContainer(container, subkey);

        if (element) {
          element.textContent = values[lang];
        }
      }
    }
  }
}

function getInLang(displayOptions) {
  return displayOptions[lang] || displayOptions[LANGS[0]];
}

function getSpellName(affinity, strength) {
  const skillname = getInLang(AFFINITIES[affinity].skill_name);
  const adj = getInLang(SKILL_LEVELS[strength].name);

  if (lang === LANGS[0]) {
    return adj + " " + skillname;
  }

  return skillname + " " + adj;
}

function getCurrentScreenID() {
  const currentScreens = document.querySelectorAll(".screen.active");

  if (currentScreens.length > 1) {
    return;
  }

  return currentScreens[0];
}

function changeScreen(fromScreenId, toScreenId, isNewGame) {
  const fromScreen = document.getElementById(fromScreenId);
  const toScreen = document.getElementById(toScreenId);

  if (fromScreenId === SCREENS.screen_game) {
    Game.quitInstance();
  }

  switch (toScreenId) {
    case SCREENS.screen_main.id:
      break;
    case SCREENS.screen_map.id:
      if (isNewGame) {
        Game.instance.profile = newProfile();
      }

      const max = Game.instance.profile.level_progress;
      for (var i = 0; i < LEVELS.length; i++) {
        const levelBtn = getFromContainer(toScreen, "btn_level" + i);
        const availability = i <= max ? 1 : 0;

        // levelBtn.className = MAPMENU.buttons.lvl_class + availability;
        levelBtn.disabled = !availability;
      }
      break;
    default:
      Game.STOPPED = false;
      Game.PAUSED = false;
      Game.instance.setLevel(Game.selectedLevel);
      Game.resetInstance();
      Game.instance.play();
  }

  fromScreen.classList.add("fade-out");
  fromScreen.addEventListener("animationend", function handleAnimationEnd() {
    fromScreen.classList.remove("active", "fade-out", "current-screen");
    fromScreen.removeEventListener("animationend", handleAnimationEnd);

    toScreen.classList.add("active", "fade-in", "current-screen");
    toScreen.addEventListener("animationend", function handleAnimationEnd() {
      toScreen.classList.remove("fade-in");
      toScreen.removeEventListener("animationend", handleAnimationEnd);
    });
  });
}

function updateScreen(toScreenId) {
  const screen = document.getElementById(toScreenId);

  switch (toScreenId) {
    case SCREENS.screen_main:
      break;
    case SCREENS.screen_map:
      const max = Game.instance.profile.level_progress;
      for (var i = 0; i < LEVELS.length; i++) {
        const levelBtn = getFromContainer(screen, "btn_level" + i);
        const availability = i <= max ? 1 : 0;

        // levelBtn.className = MAPMENU.buttons.lvl_class + availability;
        levelBtn.disabled = !availability;
      }
      break;
    default:
      Game.STOPPED = false;
      Game.PAUSED = false;
      Game.instance.setLevel(selectedLevel);
      Game.resetInstance();
      Game.instance.play();
  }
}

function setToPreviousScreen(current) {
  var previous = null;

  switch (current) {
    case SCREENS.screen_game:
      previous = SCREENS.screen_map;
      break;
    case SCREENS.screen_map:
    default:
      previous = SCREENS.screen_main;
  }

  setToScreen(previous);
}

function setGameStatusVisibility(elemId) {
  DISPLAY.other.game_status.forEach(function (id) {
    const element = document.getElementById(id);

    setVisibility(element, element.id === elemId);
  });
}

function updateMap() {
  const container = document.getElementById("level_select_container");

  const max = Game.instance.profile.level_progress;
  for (var i = 0; i < LEVELS.length; i++) {
    const levelBtn = getFromContainer(container, i);
    const availability = i <= max ? 1 : 0;

    // levelBtn.className = MAPMENU.buttons.lvl_class + availability;
    levelBtn.disabled = !availability;
  }
}

function updateLevelSelection(level) {
  if (isWithinPlayerProgress(level)) {
    const displayText = getInLang(DISPLAY.elements.screen_map.selected_level);

    document.getElementById("selected_level").textContent =
      displayText + ": " + (level + 1);
    Game.selectedLevel = level;
  }
}

// HTML

function getFromContainer(container, id) {
  return container.querySelector("#" + id);
}

function setVisibility(element, toVisible) {
  element.style.display = toVisible ? "block" : "none";
}

function setHidden(id, hidden) {
  const element = document.getElementById(id);

  if (hidden) {
    element.classList.add("hidden");
  } else {
    element.classList.remove("hidden");
  }
}

function addListener(id, trigger, action) {
  document.getElementById(id).addEventListener(trigger, action);
}

// EFFECTS

function triggerTimedFX(element, classname, time) {
  element.classList.remove(classname);
  element.classList.add(classname);

  console.log("START");
  setTimeout(function () {
    element.classList.remove(classname);
    console.log("END");
  }, time);
}

function triggerFX(element, classname, time) {
  element.classList.add(classname);

  // element.addEventListener("animationend", function handleAnimationEnd() {
  //   element.classList.remove(classname);
  //   element.removeEventListener("animationend", handleAnimationEnd);

  //   if (callback) {
  //     callback();
  //   }
  // });

  setTimeout(function () {
    element.classList.remove(classname);

    // if (callback) {
    //   callback();
    // }
  }, time);
}

function triggerFlashFX(affinity) {
  const element = document.getElementById(AFFINITIES[affinity].cast_effect);

  triggerFX(element, "flash");
}

function triggerShakeFX(id) {
  const element = document.getElementById(id);

  triggerTimedFX(element, "shake", 500);
}
