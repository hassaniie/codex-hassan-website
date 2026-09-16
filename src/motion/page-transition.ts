import { query, type BehaviorContext, type Cleanup } from "../utilities/dom";
import { motionPresets } from "./presets";
import { lockScroll } from "./smooth-scroll";

/**
 * Leaving a route closes the same curtain the page opened with, so a
 * navigation reads as one continuous wipe rather than a hard cut. The
 * document still loads normally; the curtain covers the swap.
 */
export function initPageTransition({
  signal,
  reducedMotion,
}: BehaviorContext): Cleanup {
  const intro = query(".intro");
  if (!intro || reducedMotion) return () => {};
  const presets = motionPresets();
  let leaving = false;
  let fallback: ReturnType<typeof setTimeout> | undefined;

  const go = (href: string) => {
    if (leaving) return;
    leaving = true;
    lockScroll(true);
    intro.classList.remove("playing");
    void intro.offsetWidth;
    intro.classList.add("covering");
    // Navigate when the wipe lands, with a timer in case the event is dropped.
    const navigate = () => {
      clearTimeout(fallback);
      location.href = href;
    };
    intro.addEventListener(
      "animationend",
      (event) => {
        if ((event as AnimationEvent).animationName === "intro-enter")
          navigate();
      },
      { once: true },
    );
    fallback = setTimeout(navigate, presets.introEnter + 320);
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
      // Same-document hashes belong to the damped scroller, not to a wipe.
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
