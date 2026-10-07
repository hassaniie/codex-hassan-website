import { initCursor } from "../motion/cursor";
import { initReveals } from "../motion/reveals";
import {
  query,
  queryAll,
  type BehaviorContext,
  type Cleanup,
} from "../utilities/dom";

let dispose: Cleanup | undefined;

/** Marks the chapter being read in the guide; plain anchors without it. */
function initChapterGuide({ signal }: BehaviorContext): Cleanup {
  const chapters = queryAll("[data-case-chapter]");
  const links = queryAll<HTMLAnchorElement>("[data-chapter-link]");
  let frame = 0;
  let active = "";
  const update = () => {
    frame = 0;
    const current = [...chapters]
      .reverse()
      .find(
        (chapter) =>
          chapter.getBoundingClientRect().top <=
          Math.min(innerHeight * 0.35, 180),
      );
    const id = current?.id ?? "";
    if (id === active) return;
    active = id;
    links.forEach((link) => {
      if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener("scroll", schedule, { signal, passive: true });
  window.addEventListener("resize", schedule, { signal, passive: true });
  update();
  return () => {
    cancelAnimationFrame(frame);
    links.forEach((link) => link.removeAttribute("aria-current"));
  };
}

/** A reader who came from the homepage is offered the way back there. */
function initReturnLink() {
  const link = query<HTMLAnchorElement>("[data-case-return]");
  if (!link) return;
  try {
    const previous = new URL(document.referrer);
    if (previous.origin !== location.origin || previous.pathname !== "/")
      return;
  } catch {
    return;
  }
  link.setAttribute("href", "/");
  queryAll(".action-track > span", link).forEach((label) => {
    label.textContent = "← Back home";
  });
}

export function initCaseStudyPage() {
  dispose?.();
  initReturnLink();
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
      initChapterGuide(context),
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
