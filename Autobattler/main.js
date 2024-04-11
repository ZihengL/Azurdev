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

var files = ["char"];
var file = "char";

var target = new Vector2D(800, 300);

Battle.createInstance(files).then(function (battle) {
  function gameLoop(currentTime) {
    var deltaTime = (currentTime - lastUpdate) / 1000;
    lastUpdate = currentTime;
    // console.log(lastUpdate)

    battle.update(deltaTime);

    surface.ctx.clearRect(0, 0, surface.cv.width, surface.cv.height);
    battle.render(surface);

    requestAnimationFrame(gameLoop);
  }

  var lastUpdate = performance.now();

  battle.player.spawnUnit(file, lastUpdate);
  // battle.cpu.spawnUnit(file, lastUpdate);

  requestAnimationFrame(gameLoop);
});

// var targetPosition = new Vector2D(900, 100);
// var lastUpdate = performance.now();

// var pos = new Vector2D(100, 100);
// var target = new Vector2D(900, 200);
// var direction = pos.direction(target);

// console.log("normalized", pos.subtract(target), pos.toPolarDirection(target));
// pos.render(surface.ctx, "blue");
// target.render(surface.ctx);
// pos.join(surface.ctx, target);
