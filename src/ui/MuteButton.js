import { Container, Graphics, Text } from "pixi.js";
import { CONFIG } from "../config.js";

export class MuteButton {
  constructor() {
    this.container = new Container();
    this.muted = false;
    this._build();
  }

  _build() {
    this.bg = new Graphics();
    this._drawBg();

    this.icon = new Text({
      text: "🔊",
      style: { fontSize: 18 },
    });

    this.icon.anchor.set(0.5);
    this.icon.x = 17;
    this.icon.y = 17;

    this.container.addChild(this.bg);
    this.container.addChild(this.icon);

    this.container.x = CONFIG.SCREEN_WIDTH - 60;
    this.container.y = 20;

    this.bg.eventMode = "static";
    this.bg.cursor = "pointer";
    this.bg.on("pointerdown", () => this._toggle());
  }

  _drawBg() {
    this.bg.clear();
    this.bg
      .roundRect(0, 0, 34, 34, 8)
      .fill({ color: this.muted ? 0x7f8c8d : 0x8e44ad });
  }

  _toggle() {
    this.muted = !this.muted;
    this.icon.text = this.muted ? "🔇" : "🔊";
    this._drawBg();

    if (this.onToggle) {
      this.onToggle(this.muted);
    }
  }
}
