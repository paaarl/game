export const CONFIG = {
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,

  REEL_COUNT: 5,
  VISIBLE_ROWS: 3,
  SYMBOLS_PER_REEL: 6,
  REEL_GAP: 5,

  REEL_PADDING: 20, // padding рамки з обох боків

  get REEL_WIDTH() {
    const totalGaps = (this.REEL_COUNT - 1) * this.REEL_GAP;
    // Враховуємо padding рамки
    return Math.floor(
      (this.SCREEN_WIDTH - totalGaps - this.REEL_PADDING * 2) / this.REEL_COUNT,
    );
  },
  get SYMBOL_SIZE() {
    return this.REEL_WIDTH;
  },

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
