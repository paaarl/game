import { Container, Graphics } from "pixi.js";
import { BlurFilter } from "pixi.js";
import { CONFIG } from "../config.js";
import { Symbol } from "./Symbol.js";

export class Reel {
  constructor(x) {
    this.container = new Container();
    this.container.x = x;
    this.container.y = 0; // керує ReelSet

    this.symbols = [];
    this.spinning = false;
    this.speed = 0;
    this.stopAfter = 0;

    this._blurFilter = new BlurFilter();
    this._blurFilter.blurY = 0;
    this._blurFilter.blurX = 0;
    this._blurFilter.resolution = Math.max(window.devicePixelRatio || 1, 2);

    this.container.filters = [this._blurFilter];

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
    return CONFIG.SYMBOLS[Math.floor(Math.random() * CONFIG.SYMBOLS.length)];
  }

  spin(stopAfter) {
    this.spinning = true;
    this.speed = CONFIG.SPIN_SPEED;
    this.stopAfter = stopAfter;
    this.container.filters = [this._blurFilter];
  }

  update(delta = 1) {
    if (!this.spinning) {
      if (this._blurFilter.blurY > 0) {
        this._blurFilter.blurY = Math.max(0, this._blurFilter.blurY - 2);
        if (this._blurFilter.blurY === 0) {
          this.container.filters = [];
        }
      }
      return;
    }

    this.symbols.forEach((s) => {
      s.container.y += this.speed * delta;
    });

    this.symbols.forEach((s) => {
      if (s.container.y >= CONFIG.REEL_HEIGHT) {
        s.container.y -= CONFIG.SYMBOLS_PER_REEL * CONFIG.SYMBOL_SIZE;
        s.setValue(this._randomSymbol());
      }
    });

    const targetBlur = Math.min((this.speed / CONFIG.SPIN_SPEED) * 20, 20);
    this._blurFilter.blurY = targetBlur;
    this._blurFilter.blurX = 0;

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
      .slice(0, CONFIG.VISIBLE_ROWS)
      .map((s) => s.value);
  }
}
