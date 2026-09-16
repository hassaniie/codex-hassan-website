import { initIntro } from "../motion/intro";
import { initReveals } from "../motion/reveals";
import { initScrollScene } from "../motion/scroll-scene";
import { initCursor } from "../motion/cursor";
import type { Cleanup } from "../utilities/dom";

let dispose: Cleanup | undefined;
/** One entry point, with owned cleanup for media changes, HMR, and future layouts. */
export function initHomepage() {
  dispose?.();
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let controller: AbortController;
  let cleanups: Cleanup[] = [];
  const stop = () => {
    controller?.abort();
    cleanups.forEach((cleanup) => cleanup());
    cleanups = [];
  };
  const start = () => {
    stop();
    controller = new AbortController();
    const context = {
      signal: controller.signal,
      reducedMotion: preference.matches,
    };
    cleanups = [
      initIntro(context),
      initReveals(context),
      initScrollScene(context),
      initCursor(context),
    ];
  };
  start();
  preference.addEventListener("change", start);
  dispose = () => {
    stop();
    preference.removeEventListener("change", start);
  };
  return dispose;
}
if (import.meta.hot) import.meta.hot.dispose(() => dispose?.());
