function Screen(lang) {
  this.lang = lang;

  this.navIndex = 0;
  this.horizontalIndex = 0;
  this.setScreen("screen_main");
}

Screen.prototype.setScreen = function (screenId) {
  const options = SCREENS[screenId];

  if (options) {
    this.currentScreenId = screenId;
    this.currentScreen = document.getElementById(this.currentScreenId);

    this.navContainer = document.getElementById(options.vertical_nav);
    this.setNavIndex(0);

    if (options.horizontal_nav) {
      this.horizontalNavContainer = document.getElementById(
        options.horizontal_nav
      );
      this.setHorizontalNavIndex(0);
    }
  }
};

Screen.prototype.setNavIndex = function (index) {
  if (index >= 0 && index < this.navContainer.children.length) {
    this.navContainer.children[this.navIndex].classList.remove(".selected");
    this.navContainer.chilren[index].classList.add(".selected");
    this.navIndex = index;
  }
};

// Screen.prototype.setHorizontalNavIndex = function (index) {
//   if (
//     this.setNavIndex(this.horizontalNavContainer, this.horizontalIndex, index)
//   ) {
//     this.horizontalIndex = index;
//   }
// };

// Screen.prototype.setNavIndex = function (container, currentIdx, newIdx) {
//   if (newIdx >= 0 && newIdx < container.children.length) {
//     container.children[currentIdx].classList.remove(".selected");
//     container.children[newIdx].classList.add(".selected");

//     return true;
//   }

//   return false;
// };

Screen.prototype.registerKey = function (key) {
  if (currentScreen.id !== "screen_game" || Game.PAUSED) {
    switch (key) {
      case "ArrowUp":
        this.setNavIndex(this.navIndex + 1);
        break;
      case "ArrowDown":
        this.setNavIndex(this.navIndex - 1);
        break;
      case "ArrowLeft":
        this.setHorizontalNavIndex(this.horizontalIndex - 1);
        break;
      case "ArrowUp":
        this.setHorizontalNavIndex(this.horizontalIndex + 1);
        break;
      case "ENTER":
        break;
      default:
        console.log("Unrecognized current screen id: " + this.currentScreenId);
    }
  } else {
  }
};

Screen.prototype.enter = function () {
    const currentSelection = this.navContainer.children[this.navIndex];

  switch (currentSelection.id) {
    case "btn_continue":
      
      break;
    case "btn_newgame":

      break;
    case "ArrowLeft":

      break;
    case "ArrowUp":

      break;
    case "ENTER":
      break;
    default:
      console.log("Unrecognized current screen id: " + this.currentScreenId);
  }
};
