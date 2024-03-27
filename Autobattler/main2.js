// ! RESTRICTION:
// ! Do not use ES6 syntax, use only ES5 and older
// ! Do not use jQuery library
// ! Do not use any frameworks
// * If you use any imported library check it by top restrictions

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  dx: 5,
  dy: 4,
};

document.addEventListener("keydown", handleKeyAction);

// Add this listener to your page

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ball.x += ball.dx;
  ball.y += ball.dy;

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(gameLoop);
}

/* -------------------------------------------------------------------------- */
/*       Key listener function to use PC keyboard and TV remote control       */
/* -------------------------------------------------------------------------- */

const KEY_ACTIONS = {
  37: "left", // LEFT KEY
  38: "up", // UP KEY
  39: "right", // RIGHT KEY
  40: "down", // DOWN KEY
  13: "enter", // ENTER KEY
  32: "spacebar", // SPACEBAR
  49: "1", // 1
  50: "market", // 2
  51: "inventory", // 3
  457: "info", // INFO KEY ON REMOTE CTRL
  461: "back", // RETURN KEY ON REMOTE CTRL
  10009: "back", // RETURN KEY ON REMOTE CTRL (another code)
  27: "back", // ESC KEY ON PC
  1001: "exit", // EXIT KEY ON REMOTE CTRL
  80: "p", // p on keyboard
};

function handleKeyAction(event) {
  const action = KEY_ACTIONS[event.keyCode];

  switch (action) {
    case "left":
    case "up":
    case "right":
    case "down":
    case "enter":
      arrowNav(action);
      break;
    case "market":
    case "inventory":
      openInfoPanel(action);
      break;
    case "back":
      back();
      break;
    case "spacebar":
    case "1":
    case "p":
    case "info":
    case "exit":
      // Handle these cases as needed
      break;
  }

  // Optionally, prevent default action if the key is recognized
  if (action) {
    event.preventDefault();
  }
}

function buttonHandler(element) {
  console.log(element);

  switch (element.id) {
    case "btn_start":
      console.log("start button pressed");
      gameLoop();
    case "up":
    case "right":
    case "down":
    case "enter":
      arrowNav(action);
      break;
    case "market":
    case "inventory":
      openInfoPanel(action);
      break;
    case "back":
      back();
      break;
    case "spacebar":
    case "1":
    case "p":
    case "info":
    case "exit":
      // Handle these cases as needed
      break;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  // Button properties
  const button = {
    x: 50,
    y: 25,
    width: 100,
    height: 50,
    text: "Click Me",
  };

  // Draw the button
  function drawButton() {
    ctx.fillStyle = "#007bff"; // Button color
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = "#ffffff"; // Text color
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      button.text,
      button.x + button.width / 2,
      button.y + button.height / 2
    );
  }

  // Check if the click is inside the button
  function isClickInsideButton(x, y) {
    return (
      x > button.x &&
      x < button.x + button.width &&
      y > button.y &&
      y < button.y + button.height
    );
  }

  // Handle canvas click events
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isClickInsideButton(x, y)) {
      alert("Button Clicked!");
    }
  });

  drawButton();
});
