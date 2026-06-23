import { Container, Graphics } from "pixi.js";
import { CONFIG } from "../config.js";

const PAYLINES = [
  [1, 1, 1, 1, 1], // 0: Пряма по центру
  [0, 0, 0, 0, 0], // 1: Пряма зверху
  [2, 2, 2, 2, 2], // 2: Пряма знизу
  [0, 1, 2, 1, 0], // 3: Зигзаг зверху вниз
  [2, 1, 0, 1, 2], // 4: Зигзаг знизу вгору
  [0, 0, 1, 0, 0], // 5: Прогин зверху
  [2, 2, 1, 2, 2], // 6: Прогин знизу
  [1, 0, 0, 0, 1], // 7: Сходинка вгору
  [1, 2, 2, 2, 1], // 8: Сходинка вниз
  [1, 1, 0, 1, 1], // 9: Підйом по центру
];

export class WinLine {
  constructor() {
    this.container = new Container();
    this.lineGraphics = new Graphics();
    this.container.addChild(this.lineGraphics);
  }

  showLine(lineIndex, startX, startY) {
    this.clear();

    const linePattern = PAYLINES[lineIndex];
    if (!linePattern) return;

    this.lineGraphics.stroke({
      color: 0xf0c040,
      width: 5,
      cap: "round",
      join: "round",
    });

    const stepX = CONFIG.REEL_WIDTH + 10;
    const stepY = CONFIG.SYMBOL_SIZE;

    linePattern.forEach((rowIndex, reelIndex) => {
      const x = startX + reelIndex * stepX + CONFIG.REEL_WIDTH / 2;
      const y = startY + rowIndex * stepY + CONFIG.SYMBOL_SIZE / 2;

      if (reelIndex === 0) {
        this.lineGraphics.moveTo(x, y);
      } else {
        this.lineGraphics.lineTo(x, y);
      }
    });
  }

  clear() {
    this.lineGraphics.clear();
  }
}
