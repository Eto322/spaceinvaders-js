canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
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

// Player model logic
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
class Shoot {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
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
}

class EnemyGrid {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 2, y: 0 };
    this.enemies = [];
    const rows=Math.random()*5+1;
    const columns=Math.random()*5+1;

    this.width=columns*100;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++){
        this.enemies.push(new Enemy({ position: { x: i*40, y: j*40 } }));
      }
      
    }
    console.log(this.enemies);
  }

  update() {
  
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if(this.position.x+this.width>=canvas.width||this.position.x<=0){
      this.velocity.x=-this.velocity.x;
    }

  }
}

// Game logic

const player = new Player();

const shoots = [];
const enemieGrids = [new EnemyGrid()];

//game loop
function gameLoop() {
  window.requestAnimationFrame(gameLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();//draw player
  shoots.forEach((shoot) => {
    if (shoot.position.y < 0) {
      shoots.splice(shoots.indexOf(shoot), 1);
    } else shoot.update();//draw and removedshoots
  });

  enemieGrids.forEach((enemieGrid) => {
    enemieGrid.update();//draw Grid
    enemieGrid.enemies.forEach((enemy) => {
      enemy.update(enemieGrid.velocity);//draw enemy
        shoots.forEach((shoot) => {//detect collision
          if(shoot.position.y-5<=enemy.position.y+enemy.height
            &&shoot.position.y+5>=enemy.position.y
            &&shoot.position.x-5<=enemy.position.x+enemy.width
            &&shoot.position.x+5>=enemy.position.x)
              
          {
            setTimeout(() => {
              enemieGrid.enemies.splice(enemieGrid.enemies.indexOf(enemy), 1);//remove enemy after shoot
              shoots.splice(shoots.indexOf(shoot), 1);//remove shoot that kill enemy 


              //check if grid is empty and add new collison with sides 
              if(enemieGrid.enemies.length>0){
                const frist= enemieGrid.enemies[0];
                const last=enemieGrid.enemies[enemieGrid.enemies.length-1];
                if(frist.position.x<0){
                  enemieGrid.velocity.x=2;
                }
                if(last.position.x+last.width>canvas.width){
                  enemieGrid.velocity.x=-2;
                }
              }
            }, 0);
          }
        });
    });
  });

  if (
    keys.ArrowRight.isDown &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 5;
  } else if (keys.ArrowLeft.isDown && player.position.x > 0) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
  }

  if(animationloopIndex%5000==0){
    enemieGrids.push(new EnemyGrid());
    console.log("5000 frames");
  }

  
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
      shoots.push(
        new Shoot(
          { x: player.position.x + player.width / 2 + 7, y: player.position.y }, //+ 7 is for the center of the ship
          { x: 0, y: -8 }
        )
      );
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
