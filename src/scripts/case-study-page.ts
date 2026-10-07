import { initCursor } from "../motion/cursor";
import { initReveals } from "../motion/reveals";
import { initSectionScenes } from "../motion/scenes/sections";
import { lockScroll } from "../motion/smooth-scroll";
import { caseStudyReturn } from "../utilities/case-study-navigation";
import {
  query,
  queryAll,
  type BehaviorContext,
  type Cleanup,
} from "../utilities/dom";

/** A readable, native anchor guide also works when JavaScript is unavailable. */
function initReadingGuide({ signal }: BehaviorContext): Cleanup {
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

/** Native dialog owns focus trapping and Escape; the shared scroller pauses. */
function initArtworkViewer({ signal }: BehaviorContext): Cleanup {
  const viewer = query<HTMLDialogElement>(".case-artwork-viewer");
  if (!viewer) return () => {};
  const pane = query(".case-viewer-scroll", viewer);
  const zoom = query<HTMLButtonElement>("[data-zoom-artwork]", viewer);
  let opener: HTMLElement | null = null;
  const restore = () => {
    lockScroll(false);
    opener?.focus({ preventScroll: true });
    opener = null;
  };
  queryAll<HTMLAnchorElement>("[data-open-artwork]").forEach((link) => {
    link.addEventListener(
      "click",
      (event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        opener = link;
        lockScroll(true);
        viewer.showModal();
        if (pane) {
          pane.removeAttribute("data-zoomed");
          pane.scrollTop = 0;
          pane.scrollLeft = 0;
        }
        zoom?.setAttribute("aria-pressed", "false");
      },
      { signal },
    );
  });
  zoom?.addEventListener(
    "click",
    () => {
      if (!pane) return;
      const expanded = !pane.hasAttribute("data-zoomed");
      const ratio = expanded ? 2 : 0.5;
      const centreX = pane.scrollLeft + pane.clientWidth / 2;
      const centreY = pane.scrollTop + pane.clientHeight / 2;
      pane.toggleAttribute("data-zoomed", expanded);
      zoom.setAttribute("aria-pressed", String(expanded));
      pane.scrollLeft = centreX * ratio - pane.clientWidth / 2;
      pane.scrollTop = centreY * ratio - pane.clientHeight / 2;
    },
    { signal },
  );
  query("[data-close-artwork]", viewer)?.addEventListener(
    "click",
    () => viewer.close(),
    { signal },
  );
  viewer.addEventListener("close", restore, { signal });
  viewer.addEventListener(
    "click",
    (event) => {
      if (event.target !== viewer) return;
      const bounds = viewer.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        viewer.close();
    },
    { signal },
  );
  return () => {
    if (viewer.open) {
      viewer.close();
      restore();
    }
  };
}

let dispose: Cleanup | undefined;
export function initCaseStudyPage() {
  dispose?.();
  const returnLink = query<HTMLAnchorElement>("[data-case-return]");
  if (returnLink) {
    const destination = caseStudyReturn(
      location.search,
      document.referrer,
      location.origin,
    );
    returnLink.setAttribute("href", destination.href);
    queryAll(".action-track > span", returnLink).forEach((label) => {
      label.textContent = destination.label;
    });
  }
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
      initSectionScenes(context),
      initReadingGuide(context),
      initArtworkViewer(context),
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
