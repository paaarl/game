import { Container, Graphics, Sprite, Assets } from "pixi.js";
import { CONFIG } from "../config.js";

export class ReelBackground {
  constructor() {
    this.container = new Container();
    // Конструктор тепер просто створює контейнер, а будувати будемо асинхронно
  }

  async init() {
    const width = CONFIG.REEL_COUNT * (CONFIG.REEL_WIDTH + 10) + 20;
    const height = CONFIG.REEL_HEIGHT + 20;

    // 1. Створюємо маску (задає округлу форму для картинки)
    const mask = new Graphics();
    mask.roundRect(0, 0, width, height, 12).fill({ color: 0xffffff }); // Колір для маски неважливий

    this.container.addChild(mask);

    try {
      // 2. Завантажуємо твою картинку (заміни шлях на свій асет)
      const texture = await Assets.load("public/assets/bg-reels.png");
      const bgSprite = new Sprite(texture);

      // Підганяємо картинку під розмір панелі барабанів
      bgSprite.width = width;
      bgSprite.height = height;

      // Застосовуємо маску, щоб картинка мала округлі кути (радіус 12)
      bgSprite.mask = mask;

      this.container.addChild(bgSprite);
    } catch (error) {
      console.error(
        "Не вдалося завантажити фон барабанів, ставлю дефолтний колір:",
        error,
      );

      // Фолбек: якщо картинка не завантажилась, малюємо стару темну панель
      const panel = new Graphics();
      panel.roundRect(0, 0, width, height, 12).fill({ color: 0x0a0a1a });
      this.container.addChild(panel);
    }

    // 3. Малюємо фіолетову рамку навколо (вона поверх картинки)
    const border = new Graphics();
    border
      .roundRect(0, 0, width, height, 12)
      .stroke({ color: 0x8e44ad, width: 3 });

    this.container.addChild(border);

    // Центрування панелі на екрані
    const totalWidth = CONFIG.REEL_COUNT * (CONFIG.REEL_WIDTH + 10);
    this.container.x = (CONFIG.SCREEN_WIDTH - totalWidth) / 2 - 10;
    this.container.y = 90;
  }
}
