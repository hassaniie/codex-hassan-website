import { initCursor } from "../motion/cursor";
import { initReveals } from "../motion/reveals";
import type { Cleanup } from "../utilities/dom";

let dispose: Cleanup | undefined;

/** The privacy page ends with the homepage's contact section, so it runs the
 *  same reveals and cursor that section has there. */
export function initPrivacyPage() {
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
