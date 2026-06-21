export const CONFIG = {
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,

  REEL_COUNT: 3, // ← міняйте кількість барабанів тут
  VISIBLE_ROWS: 3, // ← міняйте кількість видимих рядів тут
  SYMBOLS_PER_REEL: 6, // ← має бути >= VISIBLE_ROWS + 2
  SYMBOL_SIZE: 100,
  REEL_WIDTH: 110,
  REEL_GAP: 10, // ← відступ між барабанами

  get REEL_HEIGHT() {
    return this.VISIBLE_ROWS * this.SYMBOL_SIZE;
  },

  SPIN_SPEED: 25,
  SPIN_DURATION: 60,
  REEL_STOP_DELAY: 20,

  START_BALANCE: 1000,
  BET_AMOUNT: 10,

  SYMBOLS: ["EMU", "KANGAROO", "💎"],

  PAYOUTS: {
    "💎": 50,
    KANGAROO: 8,
    EMU: 5,
  },
};
