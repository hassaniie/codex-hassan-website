import { initNavigation } from "./navigation";
import { initClock } from "./clock";
import { initContact } from "./contact";
import type { Cleanup } from "../utilities/dom";

let dispose: Cleanup | undefined;
/** Shared shell behavior, independent of any homepage-only scene. */
export function initSite() {
  dispose?.();
  const controller = new AbortController();
  const context = { signal: controller.signal, reducedMotion: false };
  const cleanups = [initNavigation(context), initClock(), initContact(context)];
  dispose = () => {
    controller.abort();
    cleanups.forEach((cleanup) => cleanup());
  };
  return dispose;
}
if (import.meta.hot) import.meta.hot.dispose(() => dispose?.());
