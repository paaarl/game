import { Container, Graphics } from "pixi.js";
import { CONFIG } from "../config.js";

export class WinLine {
  constructor() {
    this.container = new Container();
    this._build();
  }

  _build() {
    const totalWidth =
      CONFIG.REEL_COUNT * CONFIG.REEL_WIDTH +
      (CONFIG.REEL_COUNT - 1) * CONFIG.REEL_GAP;

    const leftArrow = new Graphics();
    leftArrow.poly([-30, 0, -10, -15, -10, 15]).fill({ color: 0xe74c3c });

    const rightArrow = new Graphics();
    rightArrow
      .poly([totalWidth + 30, 0, totalWidth + 10, -15, totalWidth + 10, 15])
      .fill({ color: 0xe74c3c });

    const leftLine = new Graphics();
    leftLine.rect(-10, -2, 15, 4).fill({ color: 0xe74c3c });

    const rightLine = new Graphics();
    rightLine.rect(totalWidth - 5, -2, 15, 4).fill({ color: 0xe74c3c });

    this.container.addChild(leftArrow);
    this.container.addChild(rightArrow);
    this.container.addChild(leftLine);
    this.container.addChild(rightLine);

    this.container.x = (CONFIG.SCREEN_WIDTH - totalWidth) / 2;
    this.container.y = 100 + CONFIG.REEL_HEIGHT / 2;
  }
}
