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

function changeScreen(fromScreenId, toScreenId) {
  const fromScreen = document.getElementById(fromScreenId);
  const toScreen = document.getElementById(toScreenId);

  if (fromScreenId === SCREENS.GAME) {
    Level.quitInstance();
  }

  switch (toScreenId) {
    case SCREENS.MAIN:
      break;
    case SCREENS.MAP:
      for (var i = 0; i < LEVELS.length; i++) {
        const levelBtn = getFromContainer(toScreen, "btn_level" + i);
        const availability = isWithinPlayerProgress(i) ? 1 : 0;

        // levelBtn.className = MAPMENU.buttons.lvl_class + availability;
        levelBtn.disabled = !availability;
      }
      break;
    default:
      Level.STOPPED = false;
      Level.PAUSED = false;
      Level.instance.setLevel(Level.selectedLevel);
      Level.resetInstance();
      Level.instance.play();
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

  // updateScreen(screenId);
  // currentScreen = toScreenId;
}

function updateScreen(toScreenId) {
  const screen = document.getElementById(toScreenId);

  switch (toScreenId) {
    case SCREENS.MAIN:
      break;
    case SCREENS.MAP:
      for (var i = 0; i < LEVELS.length; i++) {
        const levelBtn = getFromContainer(screen, "btn_level" + i);
        const availability = isWithinPlayerProgress(i) ? 1 : 0;

        // levelBtn.className = MAPMENU.buttons.lvl_class + availability;
        levelBtn.disabled = !availability;
      }
      break;
    default:
      Level.STOPPED = false;
      Level.PAUSED = false;
      Level.instance.setLevel(selectedLevel);
      Level.resetInstance();
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
  const container = document.getElementById("level_select_container");

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
  return level <= loadProfile().level_progress;
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

function triggerTimedFX(container, classname, time) {
  container.classList.add(classname);

  setTimeout(function () {
    container.classList.remove(classname);
  }, time);
}

function triggerFX(container, classname, time) {
  container.classList.add(classname);

  if (time) {
    setTimeout(function () {
      container.classList.remove(classname);
    }, time);
  } else {
    container.addEventListener("animationend", function handleAnimationEnd() {
      container.classList.remove(classname);
      container.removeEventListener("animationend", handleAnimationEnd);
    });
  }
}

function triggerFlashFX(affinity) {
  const element = document.getElementById(AFFINITIES[affinity].cast_effect);

  triggerFX(element, "flash");
}

function triggerShakeFX(containerID, intensity) {
  const element = document.getElementById(containerID);
  const baseline = 5;

  if (intensity) {
    intensity = intensity * baseline;
    document.documentElement.style.setProperty("--shake", intensity + "px");
  }

  triggerFX(element, "shake");
  document.documentElement.style.setProperty("--shake", baseline + "px");
}
