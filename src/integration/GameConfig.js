import { Container, Sprite, Assets } from "pixi.js";
import { CONFIG } from "../config.js";
import { ReelSet } from "../objects/ReelSet.js";
import { WinChecker } from "../logic/WinChecker.js";
import { GameState } from "../state/GameState.js";
import { ReelBackground } from "../ui/ReelBackground.js";
import { WinLine } from "../ui/WinLine.js";
import { AudioManager } from "../audio/AudioManager.js";
import { ParticleEmitter } from "../effects/ParticleEmitter.js";
import { useGameStore, registerActions } from "../store/gameStore.js";

// Копіюємо сюди карту ліній, щоб сцена знала, які саме символи затемнювати, а які підсвічувати
const SCENE_PAYLINES = [
  [1, 1, 1, 1, 1], // 0: Пряма по центру
  [0, 0, 0, 0, 0], // 1: Пряма зверху
  [2, 2, 2, 2, 2], // 2: Пряма знизу
  [0, 1, 2, 1, 0], // 3: Зигзаг зверху вниз
  [2, 1, 0, 1, 2], // 4: Зигзаг знизу вгору
  [0, 0, 1, 0, 0], // 5: Прогин зверху
  [2, 2, 1, 2, 2], // 6: Прогин знизу
  [1, 0, 0, 0, 1], // 8: Сходинка вгору
  [1, 2, 2, 2, 1], // 9: Сходинка вниз
  [1, 1, 0, 1, 1], // 10: Підйом по центру
];

export class GameScene {
  constructor(app) {
    this.app = app;
    this.container = new Container();
    this._muted = false;
    this._winAnimationTimer = 0;
    this._isWinAnimating = false;
  }

  async init() {
    this.gameState = new GameState();
    this.winChecker = new WinChecker();
    this.reelSet = new ReelSet();
    this.winLine = new WinLine();
    this.audio = new AudioManager();
    this.particles = new ParticleEmitter();

    this.reelBackground = new ReelBackground();
    await this.reelBackground.init();

    this.audio.loadMusic("public/assets/bg-music.mp3");

    registerActions({
      onSpinClick: () => this._handleSpinClick(),
      onBetIncrease: () => {
        this.gameState.increaseBet();
        useGameStore
          .getState()
          .setBalance(this.gameState.balance, this.gameState.bet);
      },
      onBetDecrease: () => {
        this.gameState.decreaseBet();
        useGameStore
          .getState()
          .setBalance(this.gameState.balance, this.gameState.bet);
      },
      onMuteToggle: () => {
        this._muted = !this._muted;
        this.audio.setMuted(this._muted);
        useGameStore.getState().setMuted(this._muted);
      },
    });

    this.reelSet.onSpinComplete = (result) => {
      const winResult = this.winChecker.check(result, this.gameState.bet);
      this.gameState.applyResult(winResult);
      useGameStore.getState().setBalance(this.gameState.balance);
      useGameStore.getState().setSpinEnabled(true);

      useGameStore
        .getState()
        .addHistoryEntry(
          this.gameState.bet,
          winResult.win,
          winResult.payout,
          winResult.symbol,
        );

      this.gameState.reset();

      if (winResult.win) {
        this.audio.playWin();
        useGameStore
          .getState()
          .showWinMessage(winResult.symbol, winResult.payout);

        this._isWinAnimating = true;
        setTimeout(() => {
          useGameStore.getState().hideWinMessage();
          this._resetWinAnimation();
        }, 4000);

        const totalWidth =
          CONFIG.REEL_COUNT * CONFIG.REEL_WIDTH +
          (CONFIG.REEL_COUNT - 1) * CONFIG.REEL_GAP;
        const startX = (CONFIG.SCREEN_WIDTH - totalWidth) / 2;
        const startY = (CONFIG.SCREEN_HEIGHT - CONFIG.REEL_HEIGHT) / 2;
        if (winResult.lineId !== undefined) {
          this.winLine.showLine(winResult.lineId, startX, startY);

          const currentLinePattern = SCENE_PAYLINES[winResult.lineId];

          this.reelSet.reels.forEach((reel, reelIndex) => {
            const targetRowIndex = currentLinePattern[reelIndex];

            reel.symbols.forEach((symbol) => {
              const realRowIndex = Math.round(
                symbol.container.y / CONFIG.SYMBOL_SIZE,
              );

              if (realRowIndex === targetRowIndex) {
                symbol.playWin(this.app);
                symbol.container.alpha = 1.0;

                for (let i = 0; i < 3; i++) {
                  setTimeout(() => {
                    if (!this._isWinAnimating) return;
                    const globalPos = symbol.container.toGlobal({
                      x: CONFIG.SYMBOL_SIZE / 2,
                      y: CONFIG.SYMBOL_SIZE / 2,
                    });
                    this.particles.burst(globalPos.x, globalPos.y, 15);
                  }, i * 400);
                }
              } else {
                symbol.container.alpha = 0.25;
              }
            });
          });
        }
      }
    };

    this.container.addChild(this.reelBackground.container);
    this.container.addChild(this.reelSet.container);
    this.container.addChild(this.winLine.container);
    this.container.addChild(this.particles.container);

    useGameStore
      .getState()
      .setBalance(this.gameState.balance, this.gameState.bet);

    this.app.ticker.add((ticker) => {
      this.reelSet.update(ticker.deltaTime, ticker.deltaMS);
      this.particles.update();

      if (this._isWinAnimating) {
        this._winAnimationTimer += ticker.deltaTime * 0.1;
        this.winLine.lineGraphics.alpha =
          0.7 + Math.sin(this._winAnimationTimer) * 0.3;
        this.winLine.lineGraphics.scale.set(
          1 + Math.sin(this._winAnimationTimer) * 0.005,
        );
      }
    });

    this.reelSet.reels.forEach((reel) => {
      reel.onStop = () => {
        this.audio.playTick();
      };
    });
  }

  _resetWinAnimation() {
    this._isWinAnimating = false;
    this.winLine.clear();
    this.winLine.lineGraphics.alpha = 1;
    this.winLine.lineGraphics.scale.set(1);

    this.reelSet.reels.forEach((reel) => {
      reel.symbols.forEach((symbol) => {
        symbol.container.alpha = 1;
      });
    });
  }

  _handleSpinClick() {
    if (!this.gameState.canSpin()) return;

    this._resetWinAnimation();

    this.audio.playMusic();
    this.audio.playSpin();

    this.gameState.startSpin();
    useGameStore.getState().setBalance(this.gameState.balance);
    useGameStore.getState().setSpinEnabled(false);
    this.reelSet.spin();
  }
}
