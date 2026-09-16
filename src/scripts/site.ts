import { initNavigation } from "./navigation";
import { initClock } from "./clock";
import { initContact } from "./contact";
import { initSmoothScroll } from "../motion/smooth-scroll";
import type { Cleanup } from "../utilities/dom";

let dispose: Cleanup | undefined;
/** Shared shell behavior, independent of any homepage-only scene. */
export function initSite() {
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
    // Damped scrolling is shell behavior: every route gets the same feel.
    cleanups = [
      initSmoothScroll(context),
      initNavigation(context),
      initClock(),
      initContact(context),
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
