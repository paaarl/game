import "./style.css";
import "./Scaler.js";

import { Application, Assets } from "pixi.js";
import "@esotericsoftware/spine-pixi-v8";
import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { CONFIG } from "./config.js";
import { GameScene } from "./integration/GameConfig.js";
import { spinePool } from "./objects/Symbol.js";
import { createRoot } from "react-dom/client";
import { App } from "./ui/react/App.jsx";
import { rescale } from "./Scaler.js";

const app = new Application();

await app.init({
  width: CONFIG.SCREEN_WIDTH,
  height: CONFIG.SCREEN_HEIGHT,
  resolution: Math.max(window.devicePixelRatio || 1, 2),
  autoDensity: true,
  backgroundAlpha: 0,
});

// app.canvas.style.width = "100%";
// app.canvas.style.height = "100%";

await Assets.load([
  { alias: "emu-atlas", src: "assets/Emu.atlas" },
  { alias: "kangaroo-atlas", src: "assets/Kangaroo.atlas" },
  { alias: "emuGlow-atlas", src: "assets/EmuSilverWinGlow.atlas" },
  { alias: "emu", src: "assets/Emu.json" },
  { alias: "kangaroo", src: "assets/Kangaroo.json" },
  { alias: "emuGlow", src: "assets/EmuSilverWinGlow.json" },
]);

for (let i = 0; i < 6; i++) {
  const emuSpine = Spine.from({ skeleton: "emu", atlas: "emu-atlas" });
  emuSpine.autoUpdate = false;
  emuSpine.visible = false;
  spinePool.emu.push(emuSpine);

  const kangarooSpine = Spine.from({
    skeleton: "kangaroo",
    atlas: "kangaroo-atlas",
  });
  kangarooSpine.autoUpdate = false;
  kangarooSpine.visible = false;
  spinePool.kangaroo.push(kangarooSpine);
}

const scene = new GameScene(app);
scene.init();

document.getElementById("pixi-container").appendChild(app.canvas);
rescale();

app.stage.addChild(scene.container);

createRoot(document.getElementById("ui-root")).render(<App />);

window.spinePool = spinePool;
window.app = app;
