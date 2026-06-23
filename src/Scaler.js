const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 600;

function resize() {
  const stage = document.getElementById("game-stage");
  if (!stage) return;

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const scale = Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT);

  const x = Math.round((vw - DESIGN_WIDTH * scale) / 2);
  const y = Math.round((vh - DESIGN_HEIGHT * scale) / 2);

  stage.style.left = `${x}px`;
  stage.style.top = `${y}px`;
  stage.style.transformOrigin = "0 0";
  stage.style.transform = `scale(${scale.toFixed(4)})`;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", resize);
} else {
  resize();
}

window.addEventListener("resize", resize, { passive: true });
window.addEventListener("orientationchange", () => setTimeout(resize, 150), {
  passive: true,
});
