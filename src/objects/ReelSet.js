import { Container } from "pixi.js";
import { CONFIG } from "../config";
import { Reel } from "./Reel";

export class ReelSet {
  constructor() {
    this.container = new Container();
    this.reels = [];
    this.spinning = false;

    this._buildReels();
  }

  _buildReels() {
    for (let i = 0; i < CONFIG.REEL_COUNT; i++) {
      const x = i * (CONFIG.REEL_WIDTH + CONFIG.REEL_GAP);
      const reel = new Reel(x);
      this.container.addChild(reel.container);
      this.reels.push(reel);
    }

    const totalWidth =
      CONFIG.REEL_COUNT * CONFIG.REEL_WIDTH +
      (CONFIG.REEL_COUNT - 1) * CONFIG.REEL_GAP;

    this.container.x = (CONFIG.SCREEN_WIDTH - totalWidth) / 2;
    this.container.y = 0;
  }

  spin() {
    if (this.spinning) return;
    this.spinning = true;

    this.reels.forEach((reel, index) => {
      const stopAfter = CONFIG.SPIN_DURATION + index * CONFIG.REEL_STOP_DELAY;
      reel.spin(stopAfter);
    });
  }

  update(deltaTime, deltaMS) {
    this.reels.forEach((reel) => reel.update(deltaTime));

    const spineDelta = deltaMS / 1000;
    this.reels.forEach((reel) => {
      reel.symbols.forEach((symbol) => {
        if (!symbol.spine) return;

        // тільки видимі символи (y в межах reel)
        const y = symbol.container.y;
        if (y >= 0 && y < CONFIG.REEL_HEIGHT) {
          symbol.spine.update(spineDelta);
        }
      });
    });

    const allStopped = this.reels.every((reel) => !reel.spinning);
    if (allStopped && this.spinning) {
      this.spinning = false;
      this._onAllStopped();
    }
  }

  _onAllStopped() {
    const result = this.reels.map((reel) => reel.getVisibleSymbols());
    if (this.onSpinComplete) {
      this.onSpinComplete(result);
    }
  }
}
