import { CONFIG } from "../config.js";

// Координати всіх 10 ліній (відповідно до твого референсу)
const PAYLINES = [
  [1, 1, 1, 1, 1], // Лінія 0: Пряма по центру
  [0, 0, 0, 0, 0], // Лінія 1: Пряма зверху
  [2, 2, 2, 2, 2], // Лінія 2: Пряма знизу
  [0, 1, 2, 1, 0], // Лінія 3: Зигзаг зверху вниз
  [2, 1, 0, 1, 2], // Лінія 4: Зигзаг знизу вгору
  [0, 0, 1, 0, 0], // Лінія 5: Прогин зверху
  [2, 2, 1, 2, 2], // Лінія 6: Прогин знизу
  [1, 0, 0, 0, 1], // Лінія 7: Сходинка вгору
  [1, 2, 2, 2, 1], // Лінія 8: Сходинка вниз
  [1, 1, 0, 1, 1], // Лінія 9: Підйом по центру
];

export class WinChecker {
  check(result, bet) {
    let totalPayout = 0;
    let winningLines = [];
    let mainWinningSymbol = null;

    PAYLINES.forEach((linePattern, lineIndex) => {
      const symbolsOnLine = linePattern.map((rowIndex, reelIndex) => {
        return result[reelIndex][rowIndex];
      });

      const isWin = symbolsOnLine.every(
        (symbol) => symbol === symbolsOnLine[0],
      );

      if (isWin) {
        const symbol = symbolsOnLine[0];

        const linePayout = (CONFIG.PAYOUTS[symbol] || 0) * bet;

        totalPayout += linePayout;
        mainWinningSymbol = symbol;

        winningLines.push(lineIndex);
      }
    });

    if (winningLines.length > 0) {
      return {
        win: true,
        symbol: mainWinningSymbol,
        payout: totalPayout,
        lineId: winningLines[0],
      };
    }

    // Якщо нічого не виграло
    return { win: false, symbol: null, payout: 0, lineId: undefined };
  }
}
