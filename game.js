const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
    this.y = 300;
    this.speed = 1;
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

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  towers.push(new Tower(e.clientX - rect.left, e.clientY - rect.top));
});

function spawnEnemy() {
  enemies.push(new Enemy());
}

setInterval(spawnEnemy, 2000);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

animate();
