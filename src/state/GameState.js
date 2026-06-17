import { CONFIG } from "../config.js";

export class GameState {
  constructor() {
    this.balance = CONFIG.START_BALANCE;
    this.bet = CONFIG.BET_AMOUNT;
    this.state = "idle";
  }

  canSpin() {
    return this.state === "idle" && this.balance >= this.bet;
  }

  startSpin() {
    this.balance -= this.bet;
    this.state = "spinning";
  }

  applyResult(winResult) {
    if (winResult.win) {
      this.balance += winResult.payout;
      this.state = "win";
    } else {
      this.state = "lose";
    }
  }

  reset() {
    this.state = "idle";
  }
  increaseBet() {
    if (this.state !== "idle") return;
    this.bet = Math.min(this.bet + 10, 100);
  }

  decreaseBet() {
    if (this.state !== "idle") return;
    this.bet = Math.max(this.bet - 10, 10);
  }
}
