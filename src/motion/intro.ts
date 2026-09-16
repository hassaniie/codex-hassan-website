import { query, type BehaviorContext, type Cleanup } from "../utilities/dom";
import { motionPresets } from "./presets";
import { getSmoothScroll, lockScroll } from "./smooth-scroll";

export function initIntro({ signal, reducedMotion }: BehaviorContext): Cleanup {
  const intro = query(".intro");
  const count = query(".intro-count");
  if (!intro || !count) return () => {};
  let frame = 0;
  let release: ReturnType<typeof setTimeout> | undefined;
  const { introDuration } = motionPresets();
  // The counter is an opening sequence, not a network progress indicator.
  function play() {
    if (reducedMotion || !intro || !count) return;
    cancelAnimationFrame(frame);
    intro.classList.remove("playing");
    void intro.offsetWidth;
    intro.classList.add("playing");
    // Hold the page still behind the curtain so it opens onto the hero.
    lockScroll(true);
    // A dropped animationend must never strand the page in a locked state.
    clearTimeout(release);
    release = setTimeout(() => lockScroll(false), introDuration + 1600);
    const start = performance.now();
    function tick(time: number) {
      const progress = Math.min((time - start) / introDuration, 1);
      count!.textContent = `(${String(Math.round(100 * (1 - Math.pow(1 - progress, 3)))).padStart(2, "0")})`;
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }
  intro.addEventListener(
    "animationend",
    (event) => {
      if (event.animationName === "intro-exit") {
        intro.classList.remove("playing");
        clearTimeout(release);
        lockScroll(false);
      }
    },
    { signal },
  );
  query("#replay")?.addEventListener(
    "click",
    () => {
      const scroller = getSmoothScroll();
      if (scroller) scroller.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0, behavior: "instant" });
      play();
    },
    { signal },
  );
  play();
  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(release);
    intro.classList.remove("playing");
    lockScroll(false);
  };
}
