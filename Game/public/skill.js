function Skill(player, config, id) {
  const projectile = PROJECTILES[config];
  const stats = projectile.stats;
  const fx = projectile.fx;

  this.name = config;
  this.fx = fx;
  this.stats = projectile.stats;

  this.player = player;
  this.config = config;
  this.color = fx.color;
  this.size = fx.size;
  this.speed = fx.speed;

  this.projectiles = [];

  this.button = document.getElementById(`btn_${id}`);
  this.button.innerText = config;

  const skill = this;
  this.button.addEventListener("click", function () {
    if (player.mana >= stats.mana) {
      player.mana -= stats.mana;

      const playerCenter = player.pos.center(player.size);
      const target = player.enemies[0]; // CHANGE LATER
      console.log(player.enemies, "asdsa");
      const projectile = new Projectile(playerCenter, target, skill.config);

      skill.projectiles.push(projectile);
    }
  });
  //   document.body.appendChild(this.button);
}

Skill.prototype.cast = function () {
  if (this.player.mana >= this.stats.mana) {
    this.player.mana -= this.stats.mana;

    const playerCenter = this.player.pos.center(this.player.size);
    const target = this.player.enemies[0]; // CHANGE LATER
    const projectile = new Projectile(playerCenter, target, this.config);

    this.projectiles.push(projectile);
  }
};

Skill.prototype.update = function (deltaTime) {
  const skill = this;

  for (let i = this.projectiles.length - 1; i >= 0; i--) {
    const projectile = this.projectiles[i];
    const target = projectile.target;
    const targetCenter = target.pos.center(target.size);

    if (!projectile.pos.isEqual(targetCenter)) {
      const direction = projectile.pos.direction(targetCenter);
      projectile.velocity = direction.multiply(skill.speed);

      const displacement = projectile.velocity.multiply(deltaTime);
      projectile.pos = projectile.pos.add(displacement);
    } else {
      if (target.applyDamage(skill.stats.damage)) {
        console.log("DMG APPLIED", target.health);
      }

      this.projectiles.splice(i, 1);
    }
  }
};

Skill.prototype.render = function () {
  const skill = this;

  this.projectiles.forEach(function (projectile) {
    surface.ctx.beginPath();
    surface.ctx.arc(
      projectile.pos.x,
      projectile.pos.y,
      skill.size,
      0,
      2 * Math.PI
    );
    surface.ctx.fillStyle = skill.color;
    surface.ctx.fill();
    surface.ctx.stroke();
  });
};
