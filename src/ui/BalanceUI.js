import { Container, Graphics, Text } from "pixi.js";
import { CONFIG } from "../config.js";

export class BalanceUI {
  constructor() {
    this.container = new Container();
    this.container.x = 20;
    this.container.y = 20;

    this._buildTexts();
    this._buildBetControls();
  }

  _buildTexts() {
    this.balanceText = new Text({
      text: "Баланс: 0",
      style: { fill: 0xffffff, fontSize: 22 },
    });

    this.betText = new Text({
      text: `Ставка: ${CONFIG.BET_AMOUNT}`,
      style: { fill: 0xf1c40f, fontSize: 18 },
    });

    this.betText.y = 30;

    this.container.addChild(this.balanceText);
    this.container.addChild(this.betText);
  }

  _buildBetControls() {
    this.btnMinus = this._createBtn("-", 0);
    this.btnMinus.x = 100;
    this.btnMinus.y = 30;

    this.btnPlus = this._createBtn("+", 0);
    this.btnPlus.x = 130;
    this.btnPlus.y = 30;

    this.container.addChild(this.btnMinus);
    this.container.addChild(this.btnPlus);
  }

  _createBtn(lable, color) {
    const btn = new Container();

    const bg = new Graphics();
    bg.roundRect(0, 0, 24, 24, 6).fill({ color: 0x8e44ad });

    const text = new Text({
      text: lable,
      style: { fill: 0xffffff, fontSize: 18, fontWeight: "bold" },
    });

    text.anchor.set(0.5);
    text.x = 12;
    text.y = 12;

    btn.addChild(bg);
    btn.addChild(text);

    btn.eventMode = "static";
    btn.cursor = "pointer";

    return btn;
  }

  update(balance, bet) {
    this.balanceText.text = `Баланс: ${balance}`;
    if (bet !== undefined) {
      this.betText.text = `Ставка: ${bet}`;
    }
  }

  onBetChange(onIncrease, onDecrease) {
    this.btnPlus.on("pointerdown", onIncrease);
    this.btnMinus.on("pointerdown", onDecrease);
  }
}
