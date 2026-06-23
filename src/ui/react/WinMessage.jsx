import "../../styles/HudBar.css";
import { useGameStore } from "../../store/gameStore.js";

export function WinMessage() {
  const winMessage = useGameStore((s) => s.winMessage);
  if (!winMessage) return null;

  return (
    <div className="win-overlay">
      <div className="win-card">
        <span className="win-symbol">{winMessage.symbol}</span>
        <span className="win-label">You Win</span>
        <span className="win-payout">+{winMessage.payout}</span>
      </div>
    </div>
  );
}
