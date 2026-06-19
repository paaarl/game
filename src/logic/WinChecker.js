import { CONFIG } from "../config.js";

export class WinChecker {
  // WinChecker.js
  check(result, bet) {
    const middleRow = result.map((reel) => reel[1]);
    const isWin = middleRow.every((symbol) => symbol === middleRow[0]);

    if (isWin) {
      const symbol = middleRow[0];
      const payout = CONFIG.PAYOUTS[symbol] * bet;
      return { win: true, symbol, payout };
    }
    return { win: false, symbol: null, payout: 0 };
  }
}
