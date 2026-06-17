import { CONFIG } from "../config.js";

export class WinChecker {
  check(result) {
    const middleRow = result.map((reel) => reel[1]);

    const isWin = middleRow.every((symbol) => symbol === middleRow[0]);

    if (isWin) {
      const symbol = middleRow[0];
      const payout = CONFIG.PAYOUTS[symbol] * CONFIG.BET_AMOUNT;
      return { win: true, symbol, payout };
    }

    return { win: false, symbol: null, payout: 0 };
  }
}
