export const CONFIG = {
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,

  REEL_COUNT: 3,
  SYMBOLS_PER_REEL: 5,
  SYMBOL_SIZE: 100,
  REEL_WIDTH: 110,
  REEL_HEIGHT: 300, // 3 символи видно

  SPIN_SPEED: 25, // пікселів за кадр
  SPIN_DURATION: 60, // кадрів до зупинки (1й барабан)
  REEL_STOP_DELAY: 20, // затримка між зупинками барабанів

  START_BALANCE: 1000,
  BET_AMOUNT: 10,

  SYMBOLS: ["🍒", "🍋", "🍊", "⭐", "💎"],

  PAYOUTS: {
    "💎": 50,
    "⭐": 20,
    "🍊": 10,
    "🍋": 5,
    "🍒": 3,
  },
};
