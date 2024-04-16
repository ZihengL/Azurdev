// ! RESTRICTION:
// ! Do not use ES6 syntax, use only ES5 and older
// ! Do not use jQuery library
// ! Do not use any frameworks
// * If you use any imported library check it by top restrictions

// CHROMIUM V38 broswerling.com - 000webhost.org
// Inspect >

// 6 MAX SPELLS
// ENEMY VULNERABILITIES
// ENEMY HAVE DEFENSIVE SPELLS IF PLAYER SPAMS. THEY ATTACK IF USER TAKE TOO LONG

// UPLOAD TO HOST

var offset = 0;
var player = new Player();
var bot = new Bot();
player.enemies.push(bot);

loadBackgrounds().then(function (backgrounds) {
  function gameloop(currentTime) {
    const deltaTime = (currentTime - lastUpdate) / 1000;
    lastUpdate = currentTime;
    offset = renderWithParallax(surface, backgrounds, offset);
    player.update(deltaTime);
    player.render();

    console.log("UPDATE", player, player.skills, player.enemies);

    requestAnimationFrame(gameloop);
  }

  var lastUpdate = performance.now();
  requestAnimationFrame(gameloop);
});