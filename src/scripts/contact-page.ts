import { initIntro } from "../motion/intro";
import { initCursor } from "../motion/cursor";
import { initReveals } from "../motion/reveals";
import { initContactForm } from "./contact-form";
import type { Cleanup } from "../utilities/dom";

let dispose: Cleanup | undefined;

export function initContactPage() {
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
      initCursor(context),
      initContactForm(context),
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
