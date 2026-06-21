import { Container } from "pixi.js";
import { CONFIG } from "../config.js";
import { ReelSet } from "../objects/ReelSet.js";
import { WinChecker } from "../logic/WinChecker.js";
import { GameState } from "../state/GameState.js";
import { SpinButton } from "../ui/SpinButton.js";
import { BalanceUI } from "../ui/BalanceUI.js";
import { ReelBackground } from "../ui/ReelBackground.js";
import { WinLine } from "../ui/WinLine.js";
import { WinMessage } from "../ui/WinMessage.js";
import { AudioManager } from "../audio/AudioManager.js";
import { ParticleEmitter } from "../effects/ParticleEmitter.js";

export class GameScene {
  constructor(app) {
    this.app = app;
    this.container = new Container();
  }

  init() {
    this.gameState = new GameState();
    this.winChecker = new WinChecker();
    this.reelSet = new ReelSet();
    this.spinButton = new SpinButton();
    this.balanceUI = new BalanceUI();
    this.reelBackground = new ReelBackground();
    this.winLine = new WinLine();
    this.winMessage = new WinMessage();
    this.audio = new AudioManager();
    this.particles = new ParticleEmitter();

    this.audio.loadMusic("public/assets/bg-music.mp3");

    this.balanceUI.onBetChange(
      () => {
        this.gameState.increaseBet();
        this.balanceUI.update(this.gameState.balance, this.gameState.bet);
      },
      () => {
        this.gameState.decreaseBet();
        this.balanceUI.update(this.gameState.balance, this.gameState.bet);
      },
    );

    this.reelSet.onSpinComplete = (result) => {
      const winResult = this.winChecker.check(result, this.gameState.bet);
      this.gameState.applyResult(winResult);
      this.balanceUI.update(this.gameState.balance);
      this.spinButton.setEnabled(true);
      this.gameState.reset();

      if (winResult.win) {
        this.audio.playWin();
        this.winMessage.show(winResult.symbol, winResult.payout);

        const midRow = Math.floor(CONFIG.VISIBLE_ROWS / 2);

        this.reelSet.reels.forEach((reel) => {
          const middleSymbol = reel.symbols.find(
            (s) =>
              s.container.y >= CONFIG.SYMBOL_SIZE * midRow &&
              s.container.y < CONFIG.SYMBOL_SIZE * (midRow + 1),
          );
          if (middleSymbol) {
            middleSymbol.playWin(this.app);

            const globalPos = middleSymbol.container.toGlobal({
              x: CONFIG.SYMBOL_SIZE / 2,
              y: CONFIG.SYMBOL_SIZE / 2,
            });
            this.particles.burst(globalPos.x, globalPos.y, 40);
          }
        });
      }
    };

    this.spinButton.onClick = () => {
      if (!this.gameState.canSpin()) return;

      this.audio.playMusic();
      this.audio.playSpin();

      this.gameState.startSpin();
      this.balanceUI.update(this.gameState.balance);
      this.spinButton.setEnabled(false);
      this.reelSet.spin();
    };

    this.container.addChild(this.reelBackground.container);
    this.container.addChild(this.reelSet.container);
    this.container.addChild(this.winLine.container);
    this.container.addChild(this.spinButton.container);
    this.container.addChild(this.balanceUI.container);
    this.container.addChild(this.winMessage.container);
    this.container.addChild(this.particles.container);
    this.balanceUI.update(this.gameState.balance, this.gameState.bet);

    this.app.ticker.add((ticker) => {
      this.reelSet.update(ticker.deltaTime, ticker.deltaMS);
      this.particles.update();
    });

    this.reelSet.reels.forEach((reel) => {
      reel.onStop = () => {
        this.audio.playTick();
      };
    });
  }
}
