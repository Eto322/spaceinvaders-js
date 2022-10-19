canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//usable keys
const keys = {
  ArrowRight: {
    isDown: false,
  },
  ArrowLeft: {
    isDown: false,
  },
  Space: {
    isDown: false,
  },
};

// Player model logic
class Player {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
   

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
class Shoot{
    constructor(){
    }
}

const player = new Player();

//game loop
function gameLoop() {
  window.requestAnimationFrame(gameLoop);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();

  if (keys.ArrowRight.isDown&&player.position.x+player.width<=canvas.width) {
    player.velocity.x = 5;
  } else if (keys.ArrowLeft.isDown&& player.position.x > 0) {
    player.velocity.x = -5;
  } else if (keys.Space.isDown) {
  } else {
    player.velocity.x = 0;
  }
}

gameLoop();

//Player movement logic
window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.isDown = true;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.isDown = true;
      break;
    case "Space":
      keys.Space.isDown = true;
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
    case "Space":
      keys.Space.isDown = false;
      break;
    default:
      break;
  }
});
