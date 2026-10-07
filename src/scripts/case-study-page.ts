import { initCursor } from "../motion/cursor";
import { initReveals } from "../motion/reveals";
import type { Cleanup } from "../utilities/dom";

let dispose: Cleanup | undefined;

/** A case study runs the same reveals and cursor as every other page. */
export function initCaseStudyPage() {
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
    cleanups = [initReveals(context), initCursor(context)];
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
