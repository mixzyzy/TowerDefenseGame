const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let towers = [];
let enemies = [];
let projectiles = [];

class Tower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.range = 100;
    this.fireRate = 60;
    this.timer = 0;
  }

  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
  }

  update() {
    this.timer++;
    if (this.timer >= this.fireRate) {
      const target = enemies.find(e => this.inRange(e));
      if (target) {
        projectiles.push(new Projectile(this.x, this.y, target));
        this.timer = 0;
      }
    }
  }

  inRange(enemy) {
    const dx = enemy.x - this.x;
    const dy = enemy.y - this.y;
    return Math.sqrt(dx * dx + dy * dy) < this.range;
  }
}

class Enemy {
  constructor() {
    this.x = 0;
    this.y = canvas.height / 2;
    this.speed = 2; // Made faster for visibility
    this.health = 100;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
  }

  update() {
    this.x += this.speed;
  }
}

class Projectile {
  constructor(x, y, target) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = 4;
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.x += (dx / dist) * this.speed;
    this.y += (dy / dist) * this.speed;

    if (dist < 5) {
      this.target.health -= 20;
      projectiles.splice(projectiles.indexOf(this), 1);
    }
  }
}

// Place tower where user clicks
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  towers.push(new Tower(e.clientX - rect.left, e.clientY - rect.top));
});

// Spawn enemies regularly
function spawnEnemy() {
  enemies.push(new Enemy());
}

spawnEnemy(); // Immediately spawn one
setInterval(spawnEnemy, 2000);

// Game loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Debug square to confirm canvas works
  // ctx.fillStyle = 'white';
  // ctx.fillRect(10, 10, 30, 30);

  towers.forEach(t => {
    t.update();
    t.draw();
  });

  enemies.forEach((e, i) => {
    e.update();
    e.draw();
    if (e.health <= 0) enemies.splice(i, 1);
  });

  projectiles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

console.log("Game started");
animate();

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Recenter enemies on resize
  enemies.forEach(e => e.y = canvas.height / 2);
});
