import { initCursor } from "../motion/cursor";
import { leavePage } from "../motion/page-transition";
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

/** The page this one was opened from in this tab, when it is on this site. */
function previousPage(): { url: URL; key?: string } | undefined {
  // History knows for certain; the referrer stands in where it is not exposed.
  const navigation = window.navigation;
  if (navigation?.currentEntry) {
    const entries = navigation.entries();
    let index = navigation.currentEntry.index;
    // Skip this page's own chapter jumps.
    while (index >= 0 && entries[index].sameDocument) index--;
    const entry = entries[index];
    if (entry?.url) return { url: new URL(entry.url), key: entry.key };
  }
  try {
    const url = new URL(document.referrer);
    if (url.origin === location.origin) return { url };
  } catch {
    // No referrer: the page was opened directly.
  }
  return undefined;
}

/**
 * The way back goes where the reader came from: home from the homepage, all
 * works otherwise. When that page is the one just behind this one, the link
 * steps back through history, like the browser's own Back, so the reader
 * lands where they left off instead of at the top of a fresh page.
 */
function initReturnLinks({ signal }: BehaviorContext): Cleanup {
  const previous = previousPage();
  const top = query<HTMLAnchorElement>("[data-case-return]");
  if (top && previous?.url.pathname === "/") {
    top.setAttribute("href", "/");
    queryAll(".action-track > span", top).forEach((label) => {
      label.textContent = "← Back home";
    });
  }
  const key = previous?.key;
  if (!previous || !key) return () => {};
  queryAll<HTMLAnchorElement>("[data-case-back]").forEach((link) => {
    if (new URL(link.href).pathname !== previous.url.pathname) return;
    link.addEventListener(
      "click",
      (event) => {
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        leavePage(() => {
          // A step back that cannot happen still takes the reader there.
          const fallback = () => {
            location.href = link.href;
          };
          const step = window.navigation?.traverseTo(key).finished;
          if (step) step.catch(fallback);
          else fallback();
        });
      },
      { signal },
    );
  });
  return () => {};
}

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
      initChapterGuide(context),
      initReturnLinks(context),
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
