import { useGameStore } from "../../store/gameStore.js";
import "../../styles/BetHistory.css";

export function BetHistory() {
  const history = useGameStore((s) => s.history);
  const historyOpen = useGameStore((s) => s.historyOpen);
  const toggleHistory = useGameStore((s) => s.toggleHistory);

  return (
    <>
      {/* Кнопка відкриття історії */}
      <button
        className="history-btn"
        onClick={toggleHistory}
        title="Bet History">
        📋
      </button>

      {/* Модальне вікно історії */}
      {historyOpen && (
        <div className="history-overlay" onClick={toggleHistory}>
          <div className="history-panel" onClick={(e) => e.stopPropagation()}>
            <div className="history-header">
              <span className="history-title">Bet History</span>
              <button className="history-close" onClick={toggleHistory}>
                ✕
              </button>
            </div>

            {history.length === 0 ? (
              <div className="history-empty">No spins yet</div>
            ) : (
              <div className="history-list">
                {/* Шапка таблиці */}
                <div className="history-row history-head">
                  <span>Time</span>
                  <span>Bet</span>
                  <span>Result</span>
                  <span>Payout</span>
                </div>

                {/* Рядки з даними */}
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className={`history-row ${entry.won ? "history-win" : "history-loss"}`}>
                    <span className="history-time">{entry.time}</span>
                    <span>{entry.bet}</span>
                    <span className="history-symbol">
                      {entry.won ? `${entry.symbol} WIN` : "—"}
                    </span>
                    <span
                      className={
                        entry.won ? "history-payout-win" : "history-payout-loss"
                      }>
                      {entry.won ? `+${entry.payout}` : `-${entry.bet}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
