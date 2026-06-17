import { Container, Text } from "pixi.js";
import { CONFIG } from "../config.js";

export class Symbol {
  constructor(value, x, y) {
    this.value = value;
    this.container = new Container();

    const text = new Text({
      text: value,
      style: { fontSize: CONFIG.SYMBOL_SIZE * 0.7 },
    });

    text.anchor.set(0.5);
    text.x = CONFIG.SYMBOL_SIZE / 2;
    text.y = CONFIG.SYMBOL_SIZE / 2;

    this.container.addChild(text);
    this.container.x = x;
    this.container.y = y;
  }

  playWin(app) {
    let frame = 0;
    this._winTicker = () => {
      frame++;
      this.container.alpha = Math.floor(frame / 10) % 2 === 0 ? 1 : 0.2;

      if (frame >= 60) {
        this.container.alpha = 1;
        app.ticker.remove(this._winTicker);
      }
    };
    app.ticker.add(this._winTicker);
  }

  stopWin(app) {
    if (this._winTicker) {
      app.ticker.remove(this._winTicker);
      this._winTicker = null;
    }
    this.container.alpha = 1;
  }
}
