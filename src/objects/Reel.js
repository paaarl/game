import { Container, Graphics } from "pixi.js";
import { CONFIG } from "../config.js";
import { Symbol } from "./Symbol.js";

export class Reel {
  constructor(x) {
    this.container = new Container();
    this.container.x = x;
    this.container.y = 100;

    this.symbols = [];
    this.spinning = false;
    this.speed = 0;
    this.stopAfter = 0;

    this._buildMask();
    this._buildSymbols();
  }

  _buildMask() {
    const mask = new Graphics();
    mask.rect(0, 0, CONFIG.REEL_WIDTH, CONFIG.REEL_HEIGHT).fill(0xffffff);
    this.container.addChild(mask);
    this.container.mask = mask;
  }

  _buildSymbols() {
    for (let i = 0; i < CONFIG.SYMBOLS_PER_REEL; i++) {
      const value = this._randomSymbol();
      const y = i * CONFIG.SYMBOL_SIZE;
      const symbol = new Symbol(value, 0, y);
      this.container.addChild(symbol.container);
      this.symbols.push(symbol);
    }
  }

  _randomSymbol() {
    const index = Math.floor(Math.random() * CONFIG.SYMBOLS.length);
    return CONFIG.SYMBOLS[index];
  }

  spin(stopAfter) {
    this.spinning = true;
    this.speed = CONFIG.SPIN_SPEED;
    this.stopAfter = stopAfter;
  }

  update(delta = 1) {
    if (!this.spinning) return;

    this.symbols.forEach((s) => {
      s.container.y += this.speed * delta;
    });

    this.symbols.forEach((s) => {
      if (s.container.y >= CONFIG.REEL_HEIGHT) {
        s.container.y -= CONFIG.SYMBOLS_PER_REEL * CONFIG.SYMBOL_SIZE;
        s.setValue(this._randomSymbol());
      }
    });

    this.stopAfter -= delta;
    if (this.stopAfter <= 0) {
      this._stop();
    }
  }

  _stop() {
    this.spinning = false;
    this.speed = 0;
    this._snapToGrid();
    if (this.onStop) this.onStop();
  }

  _snapToGrid() {
    this.symbols.forEach((s) => {
      s.container.y =
        Math.round(s.container.y / CONFIG.SYMBOL_SIZE) * CONFIG.SYMBOL_SIZE;
    });
  }

  getVisibleSymbols() {
    return this.symbols
      .filter((s) => s.container.y >= 0 && s.container.y < CONFIG.REEL_HEIGHT)
      .sort((a, b) => a.container.y - b.container.y)
      .slice(0, 3)
      .map((s) => s.value);
  }
}
