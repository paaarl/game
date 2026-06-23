import { create } from "zustand";

export const useGameStore = create((set) => ({
  balance: 0,
  bet: 0,
  muted: false,
  spinEnabled: true,
  winMessage: null,
  history: [],
  historyOpen: false,

  setBalance: (balance, bet) =>
    set((state) => ({
      balance,
      bet: bet !== undefined ? bet : state.bet,
    })),

  setSpinEnabled: (enabled) => set({ spinEnabled: enabled }),

  showWinMessage: (symbol, payout) => set({ winMessage: { symbol, payout } }),

  hideWinMessage: () => set({ winMessage: null }),

  setMuted: (muted) => set({ muted }),

  addHistoryEntry: (bet, won, payout, symbol) =>
    set((state) => ({
      history: [
        {
          id: Date.now(),
          bet,
          won,
          payout,
          symbol,
          time: new Date().toLocaleTimeString(),
        },
        ...state.history,
      ].slice(0, 20),
    })),

  toggleHistory: () => set((state) => ({ historyOpen: !state.historyOpen })),

  onSpinClick: () => {},
  onBetIncrease: () => {},
  onBetDecrease: () => {},
  onMuteToggle: () => {},
}));

// Функція для реєстрації зовнішньої логіки
export function registerActions(handlers) {
  useGameStore.setState(handlers);
}
