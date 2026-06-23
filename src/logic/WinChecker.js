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

    // Проходимо по кожній із 10 ліній
    PAYLINES.forEach((linePattern, lineIndex) => {
      // Збираємо символи, які лежать на поточній лінії
      // result[reelIndex][rowIndex]
      const symbolsOnLine = linePattern.map((rowIndex, reelIndex) => {
        return result[reelIndex][rowIndex];
      });

      // Перевіряємо, чи всі 5 символів на цій лінії однакові
      const isWin = symbolsOnLine.every(
        (symbol) => symbol === symbolsOnLine[0],
      );

      if (isWin) {
        const symbol = symbolsOnLine[0];

        // Розраховуємо виплату для цієї конкретної лінії
        // (Оскільки ліній 10, зазвичай ставку ділять на 10, або рахують як betPerLine.
        //  Давай поки рахувати від загальної ставки, як у тебе було)
        const linePayout = (CONFIG.PAYOUTS[symbol] || 0) * bet;

        totalPayout += linePayout;
        mainWinningSymbol = symbol; // Запам'ятовуємо символ для виведення на екран

        // Додаємо індекс лінії у список тих, що виграли
        winningLines.push(lineIndex);
      }
    });

    // Якщо хоча б одна лінія виграла
    if (winningLines.length > 0) {
      return {
        win: true,
        symbol: mainWinningSymbol,
        payout: totalPayout,
        // Повертаємо ПЕРШУ лінію, що виграла, для малювання (або можна переробити малювання під масив)
        lineId: winningLines[0],
      };
    }

    // Якщо нічого не виграло
    return { win: false, symbol: null, payout: 0, lineId: undefined };
  }
}
