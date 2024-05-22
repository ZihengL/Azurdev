// function centerX(size) {
//   return (surface.cv.width - size) / 2;
// }

// function centerY(size) {
//   return (surface.cv.height - size) / 2;
// }

// function center(width, height) {
//   return {
//     x: centerX(width),
//     y: centerY(height),
//   };
// }

// function getScreenScalarX(scalar) {
//   return surface.width * scalar;
// }

// function getScreenScalarY(scalar) {
//   return surface.height * scalar;
// }

// function getScreenScalar(scalarX, scalarY) {
//   return new Vector2D(surface.width * scalarX, surface.height * scalarY);
// }

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

function getRandom(max) {
  if (max) {
    return Math.floor(Math.random() * max);
  }

  return Math.floor(Math.random());
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

  if (JSON.stringify(saved) === "{}") {
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

// -------------- MATH

function percentage(amount, max) {
  return (amount / max) * 100;
}

// -------------- MENUS

function changeLanguage() {
  lang = lang === 0 ? 1 : 0;

  console.log("Switching language to", LANGS[lang]);

  for (const key in DISPLAY.buttons) {
    const subkeys = DISPLAY.buttons[key];
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

  for (key in DISPLAY.other.game_status) {
    const values = DISPLAY.other.game_status[key];
    const element = document.getElementById(key);

    if (element) {
      element.textContent = values[lang];
    }
  }
}

function getInLang(displayOptions) {
  return displayOptions[lang] || displayOptions[LANGS[0]];
}

function setToScreen(screenId) {
  const screens = document.getElementsByClassName("screen");

  console.log("Current screen", currentScreen);
  console.log("Setting", screenId, "to visible");
  currentScreen = screenId;
  for (var i = 0; i < screens.length; i++) {
    const screen = screens[i];

    setVisibility(screen, screen.id === screenId);
  }

  updateScreen(screenId);
}

function updateScreen(screenId) {
  const screen = document.getElementById(screenId);

  switch (screenId) {
    case SCREENS.MAIN:
      break;
    case SCREENS.MAP:
      for (var i = 0; i < LEVELS.length; i++) {
        const levelBtn = getFromContainer(screen, "btn_" + i);
        const availability = isWithinPlayerProgress(i) ? 1 : 0;

        // levelBtn.className = MAPMENU.buttons.lvl_class + availability;
        levelBtn.disabled = !availability;
      }
      break;
    default:
      Level.STOPPED = false;
      Level.PAUSED = false;
      Level.instance.setLevel(selectedLevel);
      Level.instance.play();
  }
}

function setToPreviousScreen(current) {
  var previous = null;

  switch (current) {
    case SCREENS.GAME:
      previous = SCREENS.MAP;
      break;
    case SCREENS.MAP:
    default:
      previous = SCREENS.MAIN;
  }

  setToScreen(previous);
}

function updateMap() {
  const container = document.getElementById("level_selection");

  for (var i = 0; i < LEVELS.length; i++) {
    const levelBtn = getFromContainer(container, i);
    const availability = isWithinPlayerProgress(i) ? 1 : 0;

    // levelBtn.className = MAPMENU.buttons.lvl_class + availability;
    levelBtn.disabled = !availability;
  }
}

function updateLevelSelection(level) {
  if (isWithinPlayerProgress(level)) {
    const displayText = getInLang(DISPLAY.buttons.screen_map.selected_level);

    document.getElementById("selected_level").textContent =
      displayText + ": " + (level + 1);
    Level.selectedLevel = level;
  }
}

function isWithinPlayerProgress(level) {
  return level <= profile.level_progress;
}

// HTML

function getFromContainer(container, id) {
  return container.querySelector("#" + id);
}

function setVisibility(element, toVisible) {
  element.style.display = toVisible ? "block" : "none";
}

function addListener(id, trigger, action) {
  document.getElementById(id).addEventListener(trigger, action);
}


// EFFECTS

function triggerFlashFX(affinity) {
  const id = AFFINITIES[affinity].cast_effect;
  const element = document.getElementById(id);

  element.classList.add("flash");
  setTimeout(function() {
    element.classList.remove("flash");
  }, 1000);
}