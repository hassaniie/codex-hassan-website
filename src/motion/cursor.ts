import { query, type BehaviorContext } from "../utilities/dom";

export function initCursor({ signal, reducedMotion }: BehaviorContext) {
  const dot = query(".cursor-dot");
  if (!dot || reducedMotion) return () => {};
  let frame = 0;
  let x = 0,
    y = 0;
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          dot.style.opacity = "1";
          dot.style.left = `${x}px`;
          dot.style.top = `${y}px`;
        });
    },
    { signal, passive: true },
  );
  document.addEventListener(
    "mouseleave",
    () => {
      dot.style.opacity = "0";
    },
    { signal },
  );
  return () => {
    cancelAnimationFrame(frame);
    dot.style.opacity = "0";
  };
}
