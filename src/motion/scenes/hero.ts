import { query, type BehaviorContext, type Cleanup } from "../../utilities/dom";
import { gsap, setupEngine } from "../engine";

/** The opening leaves in layers: content lifts, atmosphere trails behind it. */
export function initHeroScene({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  if (reducedMotion || !query(".hero")) return () => {};
  const context = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
    timeline
      .to(
        ".hero-main",
        { yPercent: -18, opacity: 0, filter: "blur(9px)", ease: "none" },
        0,
      )
      .to(".hero-atmosphere", { yPercent: 16, scale: 1.16, ease: "none" }, 0)
      .to(".hero-bottom", { y: -50, opacity: 0, ease: "none" }, 0);
  });
  return () => context.revert();
}
