import { Container, Text } from "pixi.js";
import { CONFIG } from "../config.js";
import { Spine } from "@esotericsoftware/spine-pixi-v8";

const SPINE_MAP = {
  EMU: "emu",
  KANGAROO: "kangaroo",
};

export const spinePool = {
  emu: [],
  kangaroo: [],
};

function getFromPool(alias) {
  if (spinePool[alias].length > 0) {
    const spine = spinePool[alias].pop();
    spine.autoUpdate = false;
    return spine;
  }
  const spine = Spine.from({
    skeleton: alias,
    atlas: `${alias}-atlas`,
  });
  spine.autoUpdate = false;
  return spine;
}

function returnToPool(alias, spine) {
  spine.state.clearTracks();
  spine.state.clearListeners();
  spine.visible = false;
  spinePool[alias].push(spine);
}

export class Symbol {
  constructor(value, x, y) {
    this.value = value;
    this.spineAlias = null;
    this.container = new Container();
    this.container.x = x;
    this.container.y = y;
    this._build();
  }

  _build() {
    if (SPINE_MAP[this.value]) {
      this._buildSpine();
    } else {
      this._buildText();
    }
  }

  _buildSpine() {
    const alias = SPINE_MAP[this.value];
    this.spineAlias = alias;

    this.spine = getFromPool(alias);
    this.spine.visible = true;

    this.spine.scale.set(0.18);
    this.spine.x = CONFIG.SYMBOL_SIZE / 2;
    this.spine.y = CONFIG.SYMBOL_SIZE;

    this.spine.state.setAnimation(0, `${this._animName()}_idle`, true);
    this.container.addChild(this.spine);
  }

  _buildText() {
    this.spine = null;
    this.spineAlias = null;

    const text = new Text({
      text: this.value,
      style: { fontSize: CONFIG.SYMBOL_SIZE * 0.7 },
    });

    text.anchor.set(0.5);
    text.x = CONFIG.SYMBOL_SIZE / 2;
    text.y = CONFIG.SYMBOL_SIZE / 2;

    this.container.addChild(text);
  }

  _animName() {
    return (
      this.value.charAt(0).toUpperCase() + this.value.slice(1).toLowerCase()
    );
  }

  setValue(newValue) {
    if (this.value === newValue) return;

    const oldAlias = this.spineAlias;

    if (this.spine && oldAlias) {
      this.container.removeChild(this.spine);
      returnToPool(oldAlias, this.spine);
      this.spine = null;
      this.spineAlias = null;
    } else {
      this.container.removeChildren();
    }

    this.value = newValue;
    this._build();
  }

  playWin(app) {
    if (this.spine) {
      const name = this._animName();
      this.spine.state.setAnimation(0, `${name}_win`, false);
      this.spine.state.addAnimation(0, `${name}_idle`, true, 0);
    } else {
      let frame = 0;
      this._winTicker = () => {
        frame++;
        this.container.alpha = Math.floor(frame / 10) % 2 === 0 ? 1 : 0.2;
        if (frame >= 60) {
          this.container.alpha = 1;
          app.ticker.remove(this._winTicker);
        }
      };
      app.ticker.add(this._winTicker);
    }
  }

  stopWin(app) {
    if (this.spine) {
      this.spine.state.setAnimation(0, `${this._animName()}_idle`, true);
    } else {
      if (this._winTicker) {
        app.ticker.remove(this._winTicker);
        this._winTicker = null;
      }
      this.container.alpha = 1;
    }
  }

  playRemove() {
    if (this.spine) {
      this.spine.state.setAnimation(0, `${this._animName()}_remove`, false);
    }
  }
}
