import { Container, Graphics } from "pixi.js";
import { CONFIG } from "../config.js";

export class ReelBackground {
  constructor() {
    this.container = new Container();
    this._build();
  }

  _build() {
    const panel = new Graphics();
    panel
      .roundRect(
        0,
        0,
        CONFIG.REEL_COUNT * (CONFIG.REEL_WIDTH + 10) + 20,
        CONFIG.REEL_HEIGHT + 20,
        12,
      )
      .fill({ color: 0x0a0a1a });

    // рамка навколо панелі
    const border = new Graphics();
    border
      .roundRect(
        0,
        0,
        CONFIG.REEL_COUNT * (CONFIG.REEL_WIDTH + 10) + 20,
        CONFIG.REEL_HEIGHT + 20,
        12,
      )
      .stroke({ color: 0x8e44ad, width: 3 });

    this.container.addChild(panel);
    this.container.addChild(border);

    const totalWidth = CONFIG.REEL_COUNT * (CONFIG.REEL_WIDTH + 10);
    this.container.x = (CONFIG.SCREEN_WIDTH - totalWidth) / 2 - 10;
    this.container.y = 90;
  }
}
