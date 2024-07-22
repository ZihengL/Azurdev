function Screen(lang, fps) {
  this.setDisplayLanguage(lang);
  this.fps = fps;

  this.surface = new Surface();
  this.game = new Game(this, lang);

  this.screenIds = Object.keys(SCREENS);
  this.screenIndex = 0;
  this.currentScreen = document.getElementById(
    this.screenIds[this.screenIndex]
  );

  this.navsIdx = 0;
  this.loadProfile();
  this.setScreen(this.currentScreen.id);

  this.screens = {};
  for (const screen in DISPLAY.elements) {
    this.screens[screen] = document.getElementById(screen);
  }
  Screen.instance = this;
}
Screen.instance = null;

// -------------- PROFILE & GAME

Screen.prototype.setProfile = function (profile) {
  local_storage_lib.branch(LOCALSTORAGE.key, profile);
  this.loadProfile();
};

Screen.prototype.loadProfile = function () {
  const profile = local_storage_lib.branch(LOCALSTORAGE.key);

  if (JSON.stringify(profile) !== "{}") {
    this.profile = profile;
  } else {
    this.setProfile(LOCALSTORAGE.defaults);
  }

  console.log("Loaded profile:", this.profile);
};

Screen.prototype.continue = function () {
  this.loadProfile();
  this.nextScreen();
};

Screen.prototype.newgame = function () {
  this.setProfile(LOCALSTORAGE.defaults);
  this.nextScreen();
};

Screen.prototype.play = function () {
  this.game.setLevel(this.selectedLevel, this.profile);
};

// -------------- SCREEN

Screen.prototype.changeLanguage = function () {
  this.setDisplayLanguage(this.lang === 1 ? 2 : 1);
};

Screen.prototype.setDisplayLanguage = function (lang) {
  this.lang = lang;
  console.log("Language Mode: " + lang);

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
};

Screen.prototype.getScreenId = function (index) {
  return this.screenIds[index];
};

Screen.prototype.getSelectedButton = function () {
  return this.navContainer.children[this.navsIdx];
};

Screen.prototype.nextScreen = function () {
  this.screenIndex = Math.min(this.screenIndex + 1, this.screenIds.length - 1);
  this.updateScreen();
};

Screen.prototype.previousScreen = function () {
  this.screenIndex = Math.max(this.screenIndex - 1, 0);
  this.updateScreen();
};

Screen.prototype.updateScreen = function () {
  const id = this.screenIds[this.screenIndex];

  switch (id) {
    case "screen_main":
      break;
    case "screen_map":
      this.updateLevelButtons();
      break;
    default:
      console.log("Screen ID not recognized:", id);
  }
  this.setScreen(id);
};

Screen.prototype.setScreen = function (screenId) {
  const options = SCREENS[screenId];
  console.log("Switching screen:", this.currentScreen.id, "-", screenId);

  if (options) {
    this.currentScreen.classList.remove("active", "current-screen");
    this.currentScreen = document.getElementById(screenId);
    this.currentScreen.classList.add("active", "current-screen");

    this.navs = {};
    this.navsIdx = 0;

    const container = document.getElementById(options.nav);
    for (var i = 0; i < container.children.length; i++) {
      const element = container.children[i];

      this.navs[i] = {
        element: element,
        index: 0,
        hasChildren: element.children.length > 0,
      };
    }

    this.setNav(this.navsIdx);
  }
};

Screen.prototype.createLevelInstance = function (level) {
  if (level <= this.profile.level_progress) {
    this.selectedLevel = level;
  }
};

// -------------- NAVIGATION

Screen.prototype.setNav = function (index) {
  if (index >= 0 && index < Object.keys(this.navs).length) {
    this.nav = this.navs[index];
    this.navsIdx = index;

    if (!this.setSubNav(this.nav.index)) {
      this.setSelected(this.nav.element);
    }
  }
};

Screen.prototype.setSubNav = function (index, subnav) {
  subnav = subnav || this.nav;

  if (subnav.hasChildren) {
    const container = subnav.element;

    if (this.isValidSubNav(container, index)) {
      this.setSelected(container.children[index]);
      subnav.index = index;
    } else {
      this.setSelected(container.children[subnav.index]);
    }

    return true;
  }

  return false;
};

Screen.prototype.setSelected = function (element) {
  if (this.selected) {
    this.selected.classList.remove("selected-btn");
  }

  this.selected = element;
  this.selected.classList.add("selected-btn");
};

Screen.prototype.isWithinBounds = function (children, index) {
  return index >= 0 && index < children.length;
};

Screen.prototype.isValidSubNav = function (subnav, index) {
  switch (true) {
    case this.isWithinBounds(subnav.children, index):
      return false;
    default:
      console.log();
  }
};

// -------------- KEYS

Screen.prototype.registerKey = function (key) {
  console.log("Key pressed:", key);

  if (this.currentScreen.id === "screen_game" && !this.game.PAUSED) {
    switch (key) {
      case "Enter":
        this.game.setPause();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "ArrowLeft":
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowRight":
        this.game.lastKeyPressed = key;
        break;
      default:
        console.log("Unrecognized key in-game:", key);
    }
  } else {
    switch (key) {
      case "Enter":
        this.selected.click();
        break;
      case "Escape":
        this.previousScreen();
        break;
      case "ArrowUp":
        this.setNav(this.navsIdx - 1);
        break;
      case "ArrowDown":
        this.setNav(this.navsIdx + 1);
        break;
      case "ArrowLeft":
        this.setSubNav(this.nav.index - 1);
        break;
      case "ArrowRight":
        this.setSubNav(this.nav.index + 1);
        break;
      default:
        console.log("Unrecognized key in-menu:", key);
    }
  }
};

// -------------- LEVEL / MAP SCREEN

Screen.prototype.isWithinPlayerProgress = function (level) {
  return level <= this.profile.level_progress;
};

Screen.prototype.updateLevelButtons = function () {
  const container = document.getElementById("level_select_container");

  for (var i = 0; i < LEVELS.length; i++) {
    const element = document.getElementById("btn_level" + i);

    if (element) {
      this.setBtnLevelClass(element, i);
    } else {
      container.appendChild(this.createLevelButton(i));
    }
  }
};

Screen.prototype.createLevelButton = function (level) {
  const button = document.createElement("button");

  button.id = "btn_level" + level;
  button.textContent = level + 1;
  button.onclick = function () {
    this.setSelectedLevel(level);
  }.bind(this);

  return this.setBtnLevelClass(button, level);
};

Screen.prototype.setBtnLevelClass = function (button, level) {
  const progress = this.profile.level_progress;

  var classname;
  if (progress > level) {
    classname = "completed";
  } else if (progress < level) {
    classname = "locked";
  } else {
    classname = "unlocked";
  }

  button.className = "btn-level " + classname;
  return button;
};

Screen.prototype.incrementLevel = function () {
  const subnav = this.navs[0];
  return this.setSubNav(subnav.index + 1, subnav);
};

Screen.prototype.decrementLevel = function () {
  const subnav = this.navs[0];
  return this.setSubNav(subnav.index - 1, subnav);
};

Screen.prototype.setSelectedLevel = function (level) {
  const nav = this.navs[0];

  if (this.isWithinPlayerProgress(level)) {
    nav.index = level;
  }
};

Screen.prototype.getSelectedLevel = function () {
  const nav = this.navs[0];

  return nav.index;
};

Screen.prototype.playLevel = function (fps) {
  this.setScreen("screen_game");

  console.log("SELECTED LEVEL:", this.getSelectedLevel());
  this.game.setLevel(this.getSelectedLevel(), this.profile);
  this.game.play(fps);
};

Screen.prototype.quitLevel = function () {
  this.game.setStopped(true);
  this.setScreen("screen_map");
};
