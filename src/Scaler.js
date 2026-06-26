const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 600;
const MOBILE_BREAKPOINT = 700;

function getHudHeight() {
  const vh = document.documentElement.clientHeight;
  return Math.min(110, Math.max(64, vh * 0.14));
}

function resize() {
  const stage = document.getElementById("game-stage");
  if (!stage) return;

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const isPortraitMobile = vw < MOBILE_BREAKPOINT;

  let scale, x, y;

  if (isPortraitMobile) {
    const hudHeight = getHudHeight();
    const availH = vh - hudHeight;

    // Вміщаємо по обох осях — менший scale перемагає
    const scaleX = vw / DESIGN_WIDTH;
    const scaleY = availH / DESIGN_HEIGHT;
    scale = Math.min(scaleX, scaleY);

    x = Math.round((vw - DESIGN_WIDTH * scale) / 2);
    y = Math.round((availH - DESIGN_HEIGHT * scale) / 2);
    y = Math.max(0, y);
  } else {
    scale = Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT);
    scale = Math.min(scale, 1); // ← додай цей рядок

    x = Math.round((vw - DESIGN_WIDTH * scale) / 2);
    y = Math.round((vh - DESIGN_HEIGHT * scale) / 2);
  }

  stage.style.left = `${x}px`;
  stage.style.top = `${y}px`;
  stage.style.transformOrigin = "0 0";
  stage.style.transform = `scale(${scale.toFixed(4)})`;
}

export { resize as rescale };

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", resize);
} else {
  resize();
}

window.addEventListener("resize", resize, { passive: true });
window.addEventListener("orientationchange", () => setTimeout(resize, 150), {
  passive: true,
});
