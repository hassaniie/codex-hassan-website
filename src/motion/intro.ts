import { query, type BehaviorContext, type Cleanup } from "../utilities/dom";
import { liftAt, motionPresets } from "./presets";
import { getSmoothScroll, lockScroll } from "./smooth-scroll";

/**
 * The opening sequence, in four phases read from tokens.css: the count runs
 * to 100, sits there, the loader dissolves, and the curtain lifts off the
 * bottom edge partway through that dissolve.
 *
 * The count is a piece of theatre, not a network reading, but it is written
 * to behave like one. A perfectly even ramp reads as an animation of a
 * number; the source's does not tick evenly, so this one carries a little
 * jitter around a straight line and is held monotonic so it can never appear
 * to count backwards.
 */
export function initIntro({ signal, reducedMotion }: BehaviorContext): Cleanup {
  const intro = query(".intro");
  const count = query(".intro-count");
  if (!intro || !count) return () => {};
  let frame = 0;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const after = (ms: number, run: () => void) => {
    timers.push(setTimeout(run, ms));
  };
  const clear = () => {
    timers.splice(0).forEach(clearTimeout);
  };

  function play() {
    if (reducedMotion || !intro || !count) return;
    cancelAnimationFrame(frame);
    clear();
    intro.classList.remove("playing", "covering", "dissolving", "lift");
    void intro.offsetWidth;
    intro.classList.add("playing");
    // Hold the page still behind the curtain so it opens onto the hero.
    lockScroll(true);

    const presets = motionPresets();
    const lift = liftAt(presets);
    // A dropped animationend must never strand the page in a locked state.
    after(lift + presets.introExit + 600, () => {
      document.documentElement.classList.remove("intro-armed");
      lockScroll(false);
    });
    after(presets.introCount + presets.introHold, () =>
      intro!.classList.add("dissolving"),
    );
    after(lift, () => intro!.classList.add("lift"));

    const start = performance.now();
    // One jitter offset per whole number, so a value never flickers between
    // two readings within the same frame band.
    const wobble = (step: number) =>
      (Math.sin(step * 12.9898) * 43758.5453) % 1;
    let shown = 0;
    function tick(time: number) {
      // Clamped at both ends: a rAF timestamp can predate the start we
      // captured, which rendered a negative count on the very first frame.
      const progress = Math.min(
        Math.max((time - start) / presets.introCount, 0),
        1,
      );
      // The jitter is damped to nothing at both ends, so the count still
      // opens on 0 and lands on 100 rather than stepping over either.
      const spread = 16 * progress * (1 - progress);
      const raw = 100 * progress + wobble(Math.floor(progress * 14)) * spread;
      shown = Math.max(shown, Math.min(100, Math.round(raw)));
      count!.textContent = `(${progress < 1 ? shown : 100})`;
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    count.textContent = "(0)";
    frame = requestAnimationFrame(tick);
  }

  intro.addEventListener(
    "animationend",
    (event) => {
      if (event.animationName !== "intro-exit") return;
      intro.classList.remove("playing", "dissolving", "lift");
      document.documentElement.classList.remove("intro-armed");
      clear();
      lockScroll(false);
    },
    { signal },
  );

  // Both the footer control and the header monogram are a request for the
  // opening: the monogram only when it would not navigate anywhere.
  const replay = (event?: Event) => {
    event?.preventDefault();
    const scroller = getSmoothScroll();
    if (scroller) scroller.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.classList.add("intro-armed");
    play();
  };
  query("#replay")?.addEventListener("click", replay, { signal });
  query(".monogram")?.addEventListener(
    "click",
    (event) => {
      const link = event.currentTarget as HTMLAnchorElement;
      if (new URL(link.href, location.href).pathname !== location.pathname)
        return;
      replay(event);
    },
    { signal },
  );

  play();
  return () => {
    cancelAnimationFrame(frame);
    clear();
    intro.classList.remove("playing", "dissolving", "lift");
    document.documentElement.classList.remove("intro-armed");
    lockScroll(false);
  };
}
