import { Container, Graphics, Sprite, Assets } from "pixi.js";
import { CONFIG } from "../config.js";

export class ReelBackground {
  constructor() {
    this.container = new Container();
  }

  async init() {
    const totalWidth =
      CONFIG.REEL_COUNT * CONFIG.REEL_WIDTH +
      (CONFIG.REEL_COUNT - 1) * CONFIG.REEL_GAP;

    const pad = CONFIG.REEL_PADDING;
    const width = totalWidth + pad * 2;
    const height = CONFIG.REEL_HEIGHT + pad * 2;

    const mask = new Graphics();
    mask.roundRect(0, 0, width, height, 12).fill({ color: 0xffffff });
    this.container.addChild(mask);

    try {
      const texture = await Assets.load("public/assets/bg-reels.png");
      const bgSprite = new Sprite(texture);
      bgSprite.width = width;
      bgSprite.height = height;
      bgSprite.mask = mask;
      this.container.addChild(bgSprite);
    } catch (error) {
      console.error("Не вдалося завантажити фон барабанів:", error);
      const panel = new Graphics();
      panel.roundRect(0, 0, width, height, 12).fill({ color: 0x0a0a1a });
      this.container.addChild(panel);
    }

    const border = new Graphics();
    border
      .roundRect(0, 0, width, height, 12)
      .stroke({ color: 0x8e44ad, width: 3 });
    this.container.addChild(border);

    // Зміщуємо на -pad щоб барабани були точно всередині рамки
    this.container.x = (CONFIG.SCREEN_WIDTH - totalWidth) / 2 - pad;
    this.container.y = (CONFIG.SCREEN_HEIGHT - CONFIG.REEL_HEIGHT) / 2 - pad;
  }
}
