import { WinMessage } from "./WinMessage.jsx";

import { HudBar } from "./HudBar.jsx";
import { BetHistory } from "./BetHistory.jsx";

export function App() {
  return (
    <>
      <HudBar />
      <WinMessage />
      <BetHistory />
    </>
  );
}
