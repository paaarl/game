import { Container, Graphics, Text } from "pixi.js";
import { CONFIG } from "../config.js";

export class SpinButton {
  constructor() {
    this.container = new Container();
    this.enabled = true;

    this._build();
  }

  _build() {
    this.bg = new Graphics();
    this._drawButton(0x27ae60);

    const lable = new Text({
      text: "SPIN",
      style: { fill: 0xffffff, fontSize: 28, fontWeight: "bold" },
    });

    lable.anchor.set(0.5);
    lable.x = 0;
    lable.y = 0;

    this.container.addChild(this.bg);
    this.container.addChild(lable);

    this.container.x = CONFIG.SCREEN_WIDTH / 2;
    this.container.y = CONFIG.SCREEN_HEIGHT - 60;

    this.container.eventMode = "static";
    this.container.cursor = "pointer";
    this.container.on("pointerdown", () => {
      if (this.enabled && this.onClick) {
        this.onClick();
      }
    });
  }

  _drawButton(color) {
    this.bg.clear();
    this.bg.roundRect(-80, -35, 160, 70, 15).fill({ color });
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    this._drawButton(enabled ? 0x27ae60 : 0x7f8c8d);
    this.container.cursor = enabled ? "pointer" : "default";
  }
}
