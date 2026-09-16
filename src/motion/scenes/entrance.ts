import { query, type BehaviorContext, type Cleanup } from "../../utilities/dom";
import { gsap, setupEngine } from "../engine";
import { entranceDelay } from "../presets";

/**
 * The page assembles as the curtain lifts rather than being whole behind it.
 * Timings hang off the same intro tokens, so shortening the curtain keeps the
 * entrance in step with it automatically.
 */
export function initEntrance({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  if (reducedMotion) return () => {};
  const start = entranceDelay();
  const context = gsap.context(() => {
    const timeline = gsap.timeline({ delay: start });
    if (query(".site-header"))
      timeline.from(
        ".site-header",
        { opacity: 0, y: -20, duration: 0.7, ease: "power3.out" },
        0,
      );
    // The backdrop settles on its own channel; see Hero.css.
    if (query(".hero-atmosphere"))
      timeline.fromTo(
        ".hero-atmosphere",
        { "--entrance-scale": 1.07 },
        { "--entrance-scale": 1, duration: 1.5, ease: "power2.out" },
        0,
      );
    if (query(".identity-card"))
      timeline.from(
        ".identity-card",
        { opacity: 0, y: 36, duration: 0.85, ease: "power3.out" },
        0.16,
      );
    // Children, not .hero-bottom itself: the scroll scene owns that element.
    if (query(".hero-bottom > *"))
      timeline.from(
        ".hero-bottom > *",
        {
          opacity: 0,
          y: 28,
          duration: 0.75,
          stagger: 0.09,
          ease: "power3.out",
        },
        0.26,
      );
  });
  return () => context.revert();
}
