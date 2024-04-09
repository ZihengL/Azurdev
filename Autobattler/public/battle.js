function Battle() {
    var playerSpawn = new Vector2D(100, 100);
    var cpuSpawn = new Vector2D(900, 900);

    this.lastFrameTime = performance.now();
    this.player = new General(playerSpawn, cpuSpawn);
    this.cpu = new General(cpuSpawn, playerSpawn);
}

Battle.prototype.update = function (deltaTime) {
    this.player.update(deltaTime);
    this.cpu.update(deltaTime);
}

Battle.prototype.render = function (ctx) {
    this.player.render(ctx);
    this.cpu.render(ctx);
}

// class Battle {
//     static LHS_SPAWN = new Vector2D(100, 100);
//     static RHS_SPAWN = new Vector2D(900, 900);

//     constructor() {
//         var playerSpawn = Battle.LHS_SPAWN;
//         var cpuSpawn = Battle.RHS_SPAWN;

//         this.lastFrameTime = performance.now();
//         this.player = new General(playerSpawn, cpuSpawn);
//         this.cpu = new General(cpuSpawn, playerSpawn);
//     }

//     update(deltaTime) {
//         this.player.update(deltaTime);
//         this.cpu.update(deltaTime);
//     }
    
//     render(ctx) {
//         this.player.render(ctx);
//         this.cpu.render(ctx);
//     }
// }