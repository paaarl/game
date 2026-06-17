import { Container, Graphics, Text } from "pixi.js";
import { CONFIG } from "../config.js";

export class WinMessage {
  constructor() {
    this.container = new Container();
    this.container.visible = false;
    this._build();
  }

  _build() {
    const bg = new Graphics();
    bg.roundRect(-150, -50, 300, 100, 20).fill({ color: 0x000000, alpha: 0.8 });

    this.text = new Text({
      text: "",
      style: {
        fill: 0xf1c40f,
        fontSize: 32,
        fontWeight: "bold",
      },
    });

    this.text.anchor.set(0.5);
    this.text.x = 0;
    this.text.y = 0;

    this.container.addChild(bg);
    this.container.addChild(this.text);

    this.container.x = CONFIG.SCREEN_WIDTH / 2;
    this.container.y = CONFIG.SCREEN_HEIGHT / 2;
  }

  show(symbol, payout) {
    this.text.text = `${symbol} +${payout}`;
    this.container.visible = true;

    setTimeout(() => {
      this.hide();
    }, 2000);
  }

  hide() {
    this.container.visible = false;
  }
}
