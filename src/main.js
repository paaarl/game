import { Application } from "pixi.js";
import { CONFIG } from "./config.js";
import { GameScene } from "./integration/GameConfig.js";

const app = new Application();

await app.init({
  width: CONFIG.SCREEN_WIDTH,
  height: CONFIG.SCREEN_HEIGHT,
  background: 0x1a1a2e,
});

document.getElementById("app").appendChild(app.canvas);

const scene = new GameScene(app);
scene.init();
app.stage.addChild(scene.container);
