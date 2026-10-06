import { initCursor } from "../motion/cursor";
import { initReveals } from "../motion/reveals";
import { queryAll, type BehaviorContext, type Cleanup } from "../utilities/dom";

let dispose: Cleanup | undefined;

/** Marks the section being read in the sticky index beside the story. */
function initCaseIndex(_: BehaviorContext): Cleanup {
  const links = queryAll<HTMLAnchorElement>(".case-index a");
  if (!links.length || !("IntersectionObserver" in window)) return () => {};
  const byId = new Map(links.map((link) => [link.hash.slice(1), link]));
  // A section counts as current while it crosses the middle of the screen.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => link.removeAttribute("aria-current"));
        byId.get(entry.target.id)?.setAttribute("aria-current", "location");
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  byId.forEach((_link, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
  return () => {
    observer.disconnect();
    links.forEach((link) => link.removeAttribute("aria-current"));
  };
}

/** A case study runs the reveals and cursor every page has, and its index. */
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
    cleanups = [
      initReveals(context),
      initCursor(context),
      initCaseIndex(context),
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
