import "../../styles/HudBar.css";
import { useGameStore } from "../../store/gameStore.js";
import { CONFIG } from "../../config.js";

export function HudBar() {
  const balance = useGameStore((s) => s.balance);
  const bet = useGameStore((s) => s.bet);
  const spinEnabled = useGameStore((s) => s.spinEnabled);
  const muted = useGameStore((s) => s.muted);
  const onBetIncrease = useGameStore((s) => s.onBetIncrease);
  const onBetDecrease = useGameStore((s) => s.onBetDecrease);
  const onSpinClick = useGameStore((s) => s.onSpinClick);
  const onMuteToggle = useGameStore((s) => s.onMuteToggle);

  return (
    <div className="hud-bar">
      {/* ── LEFT: balance + bet ── */}
      <div className="hud-left">
        <div className="hud-stat">
          <span className="hud-label">Balance</span>
          <span className="hud-value">{balance}</span>
        </div>

        <div className="hud-row">
          <div className="hud-stat">
            <span className="hud-label">Bet</span>
            <div className="bet-controls">
              <button className="bet-btn" onClick={onBetDecrease}>
                −
              </button>
              <span className="hud-value">{bet}</span>
              <button className="bet-btn" onClick={onBetIncrease}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CENTER: spin ── */}
      <div className="hud-center">
        <button
          className="spin-btn"
          disabled={!spinEnabled}
          onClick={() => spinEnabled && onSpinClick()}>
          SPIN
        </button>
      </div>

      {/* ── RIGHT: mute ── */}
      <div className="hud-right">
        <button
          className={`mute-btn${muted ? " muted" : ""}`}
          onClick={onMuteToggle}
          title={muted ? "Unmute" : "Mute"}>
          {muted ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}
