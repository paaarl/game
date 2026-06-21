import { Container, Graphics } from "pixi.js";

const COLORS = [0xffd700, 0xff6b6b, 0x00d2ff, 0xffffff, 0xff9f43];

class Particle {
  constructor() {
    this.gfx = new Graphics();
    this.reset(0, 0);
  }

  reset(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 5;

    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 4; // трохи вверх
    this.gravity = 0.2;
    this.life = 1;
    this.decay = 0.02 + Math.random() * 0.02;
    this.size = 4 + Math.random() * 6;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.3;

    this._draw();
  }

  _draw() {
    this.gfx.clear();
    // чергуємо форми — квадрат або кружок
    if (Math.random() > 0.5) {
      this.gfx
        .rect(-this.size / 2, -this.size / 2, this.size, this.size)
        .fill(this.color);
    } else {
      this.gfx.circle(0, 0, this.size / 2).fill(this.color);
    }
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.rotation += this.rotationSpeed;

    this.gfx.x = this.x;
    this.gfx.y = this.y;
    this.gfx.alpha = this.life;
    this.gfx.rotation = this.rotation;
  }

  get dead() {
    return this.life <= 0;
  }
}

export class ParticleEmitter {
  constructor() {
    this.container = new Container();
    this._particles = [];
    this._active = false;
    this._pool = [];
  }

  // x, y — координати в глобальному просторі
  burst(x, y, count = 30) {
    for (let i = 0; i < count; i++) {
      const p = this._pool.length > 0 ? this._pool.pop() : new Particle();
      p.reset(x, y);
      this.container.addChild(p.gfx);
      this._particles.push(p);
    }
    this._active = true;
  }

  update() {
    if (!this._active) return;

    for (let i = this._particles.length - 1; i >= 0; i--) {
      const p = this._particles[i];
      p.update();

      if (p.dead) {
        this.container.removeChild(p.gfx);
        this._pool.push(p); // повертаємо в пул
        this._particles.splice(i, 1);
      }
    }

    if (this._particles.length === 0) {
      this._active = false;
    }
  }
}
