// ! RESTRICTION:
// ! Do not use ES6 syntax, use only ES5 and older
// ! Do not use jQuery library
// ! Do not use any frameworks
// * If you use any imported library check it by top restrictions

//------------------------------------------------------

var surface = {};
surface.cv = document.getElementById("game_canvas");
surface.ctx = surface.cv.getContext("2d");

surface.cv.width = window.innerWidth;
surface.cv.height = window.innerHeight;

//------------------------------------------------------

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
function setOnLoad(canvas_name, projected_canvas) {
  var canvas = document.getElementById(canvas_name);
  var ctx = canvas.getContext("2d");

  canvas.width = projected_canvas.width;
  canvas.height = projected_canvas.height;

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(projected_canvas, 0, 0);
  }, 1000);
}

//------------------------------------------------------

// SpriteHandler.surface = surface;
// unit.update(performance.now());

// var testSurface = {};
// testSurface.cv = document.getElementById("test_canvas");
// testSurface.ctx = testSurface.cv.getContext("2d");

// var sheet = unit.spriteHandler.cv;
// testSurface.cv.width = sheet.width;
// testSurface.cv.height = sheet.height;

// testSurface.ctx.drawImage(sheet, 0, 0);

// var posX = 0;
// var squareSize = 50;
// var speed = 2;

// // Function to update the animation
// function gameLoop2() {
//   // Clear the canvas
//   surface.ctx.clearRect(0, 0, surface.cv.width, surface.cv.height);

//   // Draw the square at the new position
//   surface.ctx.fillStyle = 'blue';
//   surface.ctx.fillRect(posX, 100, squareSize, squareSize);

//   // Move the square
//   posX += speed;

//   // Loop the square's position
//   if (posX > surface.cv.width) {
//       posX = -squareSize;
//   }

//   // Request the next frame of the animation
//   requestAnimationFrame(gameLoop2);
// }

// -----------------------

var charfile = "char";

var unit = Unit.createInstance(charfile);
var handler = SpriteHandler.createInstance(charfile);

var position = new Vector2D(100, 100);
var velocity = new Vector2D(0, 0);
var speed = 10;

var targetPosition = new Vector2D(900, 100);

var lastUpdate = performance.now();

function gameLoop(currentTime) {
  // Calculate deltaTime in seconds
  // deltaTime = time passed between last and current update
  var deltaTime = (currentTime - lastUpdate) / 1000;
  lastUpdate = currentTime;

  // Update game logic
  // battle.update(deltaTime);

  // Render the game
  // battle.render();

  position.x += speed * deltaTime;
  var direction = targetPosition.subtract(position);

  handler.update(deltaTime, direction.normalize());

  surface.ctx.clearRect(0, 0, surface.cv.width, surface.cv.height);
  handler.render(surface, position);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the animation
// requestAnimationFrame(gameLoop);

var pos = new Vector2D(100, 100);
var target = new Vector2D(100, -100);
var direction = pos.direction(target);

console.log("normalized", direction, pos.toPolarDirection(target));
pos.render(surface.ctx, "blue");
target.render(surface.ctx);
pos.join(surface.ctx, target);
