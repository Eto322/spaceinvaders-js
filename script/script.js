const score = document.getElementById("score");
canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
let animationloopIndex = 1;
//movement keys
const keys = {
  ArrowRight: {
    isDown: false,
  },
  ArrowLeft: {
    isDown: false,
  },
};

//#region Player class
class Player {
  constructor() {
    this.velocity = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };

    const image = new Image();
    image.src = "./images/player_ship.png";
    image.onload = () => {
      this.image = image;
      this.width = image.width;
      this.height = image.height;
      this.position.x = canvas.width / 2 - this.width / 2;
      this.position.y = canvas.height - this.height - 30;
    };
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
//#endregion

//#region Player-Shoot class
class Shoot {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Enemy {
  constructor({ position }) {
    this.velocity = { x: 0, y: 0 };

    const image = new Image();
    image.src = "./images/enemy_ship.png";
    image.onload = () => {
      this.image = image;
      this.width = image.width;
      this.height = image.height;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  update(velocity) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  shoot(shoots) {
    shoots.push(
      new EnemyShoot({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
      })
    );
  }
}

//#endregion

//#region Enemy-Shoot class

class EnemyShoot {
  constructor({ position }) {
    this.position = position;
    this.velocity = { x: 0, y: 5 };
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "Blue";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

//#endregion

//#region EnemyGrid class
class EnemyGrid {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 2, y: 0 };
    this.enemies = [];
    const rows = Math.random() * 5 + 1;
    const columns = Math.random() * 5 + 1;

    this.width = columns * 100;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        this.enemies.push(new Enemy({ position: { x: i * 40, y: j * 40 } }));
      }
    }
    console.log(this.enemies);
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
    }
  }
}
//#endregion

//#region Particle class
class Particle {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.radius = Math.random() * 3;
    this.opacity = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.opacity -= 0.01;
  }
}

class BackgroundParticle {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.radius = Math.random() * 3;
    this.opacity = 0.1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.opacity < 1) this.opacity += 0.009;
  }
}
//#endregion

//#region Game class
class Game {
  constructor() {
    this.player = new Player();
    this.shoots = [];
    this.enemyGrid = new EnemyGrid();
    this.enemieGrids = [];
    this.enemieGrids.push(this.enemyGrid);
    this.enemyShoots = [];
    this.particles = [];
    this.gameover = false;
    this.scroeJ = 0;
  }

  backgroundUpdate() {
    if (this.particles.length < 1000)
      for (let i = 0; i < 100; i++) {
        this.particles.push(
          new BackgroundParticle(
            {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
            },
            { x: 0, y: 1 }
          )
        );
      }

    if (this.particles.length > 100)
      this.particles.forEach((particle) => {
        if (particle.position.y > canvas.height)
          this.particles.splice(this.particles.indexOf(particle), 1);
      });
  }

  update() {
    if (!this.gameover) {
      this.player.update();
      this.playerShootUpdate();
    }
    this.enemyShootUpdate();
    this.gridsUpdate();
    this.particleUpdate();
    if (animationloopIndex % 100 === 0) {
      this.backgroundUpdate();
    }

    if (this.gameover) {
      ctx.font = "100px Segoe UI";
      ctx.fillStyle = "red";
      ctx.fillText("GAME OVER", canvas.width / 2 - 300, canvas.height / 2);
    }
  }

  playerShoot() {
    this.shoots.push(
      new Shoot(
        {
          x: this.player.position.x + this.player.width / 2 + 7,
          y: this.player.position.y,
        }, //+ 7 is for the center of the ship
        { x: 0, y: -8 }
      )
    );
  }

  //draw and remove shoots for player
  playerShootUpdate() {
    this.shoots.forEach((shoot) => {
      if (shoot.position.y < 0) {
        this.shoots.splice(this.shoots.indexOf(shoot), 1);
      } else shoot.update();
    });
  }

  particleUpdate() {
    this.particles.forEach((particle) => {
      if (particle.opacity <= 0) {
        this.particles.splice(this.particles.indexOf(particle), 1);
      } else particle.update();
    });
  }

  //draw and remove shoots for enemy
  enemyShootUpdate() {
    this.enemyShoots.forEach((shoot) => {
      if (shoot.position.y > canvas.height) {
        this.enemyShoots.splice(this.enemyShoots.indexOf(shoot), 1);
      } else shoot.update();

      if (this.detectCollisionEnemy(shoot, this.player)) {
        console.log("lose");
        this.gameover = true;
        this.player.opacity = 0;
        for (let i = 0; i < 10; i++) {
          this.particles.push(
            new Particle(
              {
                x: this.player.position.x + this.player.width / 2 + 7,
                y: this.player.position.y + this.player.height / 2,
              },
              { x: Math.random() - 0.5, y: Math.random() - 0.5 }
            )
          );
        }
      }
    });
  }
  spawnNewGrid() {
    if (animationloopIndex % 1500 == 0) {
      this.enemieGrids.push(new EnemyGrid());
    }
  }

  spawnEnemyShoot(enemyGrid) {
    enemyGrid.enemies[
      Math.floor(Math.random() * enemyGrid.enemies.length)
    ].shoot(this.enemyShoots);
    console.log("shoot");
  }

  gridsUpdate() {
    this.enemieGrids.forEach((enemyGrid) => {
      enemyGrid.update();
      if (animationloopIndex % 100 == 0 && enemyGrid.enemies.length > 0) {
        this.spawnEnemyShoot(enemyGrid);
      }
      this.enemyUpdate(enemyGrid);
    });
  }

  enemyUpdate(enemieGrid) {
    enemieGrid.enemies.forEach((enemy) => {
      enemy.update(enemieGrid.velocity);
      this.shoots.forEach((shoot) => {
        if (this.detectCollisionPlayer(shoot, enemy)) {
          for (let i = 0; i < 10; i++) {
            this.particles.push(
              new Particle(
                {
                  x: enemy.position.x + enemy.width / 2,
                  y: enemy.position.y + enemy.height,
                },
                { x: Math.random() - 0.5, y: Math.random() - 0.5 }
              )
            );
          }
          this.removeKilledEnemy(enemieGrid, enemy, shoot);
        }
      });
    });
  }

  detectCollisionEnemy(shoot, player) {
    return (
      shoot.position.y + 10 >= player.position.y &&
      shoot.position.y <= player.position.y + player.height &&
      shoot.position.x >= player.position.x &&
      shoot.position.x <= player.position.x + player.width
    );
  }

  detectCollisionPlayer(shoot, enemy) {
    return (
      shoot.position.y - 5 <= enemy.position.y + enemy.height &&
      shoot.position.y + 5 >= enemy.position.y &&
      shoot.position.x - 5 <= enemy.position.x + enemy.width &&
      shoot.position.x + 5 >= enemy.position.x
    );
  }

  removeKilledEnemy(enemieGrid, enemy, shoot) {
    this.scroeJ += 10;
    score.innerHTML = this.scroeJ;
    console.log(this.scroeJ);
    setTimeout(() => {
      enemieGrid.enemies.splice(enemieGrid.enemies.indexOf(enemy), 1); //remove enemy after shoot
      this.shoots.splice(this.shoots.indexOf(shoot), 1); //remove shoot that kill enemy
    }, 0);
  }
  //check if grid is empty and add new collison with sides of canvas
  resizeGrid(Grid) {
    if (Grid.enemies.length > 0) {
      const frist = Grid.enemies[0];
      const last = Grid.enemies[Grid.enemies.length - 1];
      if (frist.position.x < 0) {
        Grid.velocity.x = 2;
      }
      if (last.position.x + last.width > canvas.width) {
        Grid.velocity.x = -2;
      }
    }
  }

  playerMovment() {
    if (
      keys.ArrowRight.isDown &&
      this.player.position.x + this.player.width <= canvas.width
    ) {
      this.player.velocity.x = 5;
    } else if (keys.ArrowLeft.isDown && this.player.position.x > 0) {
      this.player.velocity.x = -5;
    } else {
      this.player.velocity.x = 0;
    }
  }
}
//#endregion

const game = new Game();

//game loop
function gameLoop() {
  window.requestAnimationFrame(gameLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.update();
  game.spawnNewGrid();
  game.playerMovment();

  animationloopIndex++;
}

gameLoop();

//Player movement & shooting logic
window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.isDown = true;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.isDown = true;
      break;
    case " ":
      game.playerShoot();
      break;
    default:
      break;
  }
});

window.addEventListener("keyup", function (event) {
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.isDown = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.isDown = false;
      break;
    case " ":
      break;
    default:
      break;
  }
});
