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

  for (const key in DISPLAY) {
    const subkeys = DISPLAY[key];
    const screen = document.getElementById(key);

    if (screen) {
      for (const subkey in subkeys) {
        const values = subkeys[subkey];
        const element = getFromContainer(screen, subkey);

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

function setToScreen(screenId) {
  const screens = document.getElementsByClassName("screen");

  console.log("Current screen", currentScreen);
  console.log("Setting", screenId, "to visible");

  for (var i = 0; i < screens.length; i++) {
    const screen = screens[i];

    if (screen.id === screenId) {
      screen.style.display = "block";
      currentScreen = screen.id;
    } else {
      screen.style.display = "none";
    }
  }

  updateScreen(screenId);
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

function updateScreen(screenId) {
  const screen = document.getElementById(screenId);

  switch (screenId) {
    case SCREENS.GAME:
      Level.STOPPED = false;
      Level.PAUSED = false;
      Level.instance.play();
      break;
    case SCREENS.MAP:
      for (var i = 0; i < LEVELS.length; i++) {
        const levelBtn = getFromContainer(screen, i);
        const availability = isWithinPlayerProgress(i) ? 1 : 0;

        levelBtn.className = MAPMENU.buttons.lvl_class + availability;
        levelBtn.disabled = !availability;
      }
    default:
  }
}

function updateMap() {
  const container = document.getElementById("level_selection");

  for (var i = 0; i < LEVELS.length; i++) {
    const levelBtn = getFromContainer(container, i);
    const availability = isWithinPlayerProgress(i) ? 1 : 0;

    levelBtn.className = MAPMENU.buttons.lvl_class + availability;
    levelBtn.disabled = !availability;
  }
}

function updateLevelSelection(level) {
  if (isWithinPlayerProgress(level)) {
    const displayText = getInLang(DISPLAY.screen_map.selected_level);

    document.getElementById("selected_level").textContent =
      displayText + ": " + (level + 1);
    Level.selectedLevel = level;
  }
}

function isWithinPlayerProgress(level) {
  return level <= profile.level_progress;
}

function getFromContainer(container, id) {
  return container.querySelector("#" + id);
}

function addListener(id, trigger, action) {
  document.getElementById(id).addEventListener(trigger, action);
}
