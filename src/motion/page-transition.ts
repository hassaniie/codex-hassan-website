import { query, type BehaviorContext, type Cleanup } from "../utilities/dom";
import { lockScroll } from "./smooth-scroll";

/**
 * Leaving a route puts the curtain up in one frame, with no wipe, because
 * that is what the source does and because there is nothing here to wipe
 * over: the next document paints its own identical curtain behind this one,
 * and a cut is the only cover with no seam to get wrong.
 *
 * The count belongs to the arriving document, which plays the whole opening.
 * This one only resets the reading to (0), so the page being left never shows
 * the 100 it finished on.
 */
export function initPageTransition({
  signal,
  reducedMotion,
}: BehaviorContext): Cleanup {
  const intro = query(".intro");
  if (!intro || reducedMotion) return () => {};
  let leaving = false;
  let fallback: ReturnType<typeof setTimeout> | undefined;

  const go = (href: string) => {
    if (leaving) return;
    leaving = true;
    lockScroll(true);
    intro.classList.remove("playing", "dissolving", "lift");
    const count = query(".intro-count", intro);
    if (count) count.textContent = "(0)";
    intro.classList.add("covering");
    // Navigate once the cover has actually been painted, so the page is never
    // still visible at the moment it is replaced.
    const navigate = () => {
      clearTimeout(fallback);
      location.href = href;
    };
    requestAnimationFrame(() => requestAnimationFrame(navigate));
    fallback = setTimeout(navigate, 160);
  };

  document.addEventListener(
    "click",
    (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      // Same-document hashes belong to the damped scroller, not to a curtain.
      if (url.pathname === location.pathname) return;
      event.preventDefault();
      go(url.href);
    },
    { signal },
  );

  // Returning through history must never land on a page still under a curtain.
  const reset = (event: PageTransitionEvent) => {
    if (!event.persisted) return;
    leaving = false;
    clearTimeout(fallback);
    intro.classList.remove("covering");
    document.documentElement.classList.remove("intro-armed");
    lockScroll(false);
  };
  window.addEventListener("pageshow", reset, { signal });

  return () => {
    clearTimeout(fallback);
    intro.classList.remove("covering");
    leaving = false;
  };
}
