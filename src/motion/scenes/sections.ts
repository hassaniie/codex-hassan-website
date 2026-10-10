import { query, type BehaviorContext, type Cleanup } from "../../utilities/dom";
import { gsap, setupEngine } from "../engine";

/** Quieter depth passes for the remaining sections. */
export function initSectionScenes({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  if (reducedMotion) return () => {};
  const context = gsap.context(() => {
    const drift = (
      selector: string,
      trigger: string,
      from: number,
      to: number,
    ) => {
      const element = query(selector);
      if (!element || !query(trigger)) return;
      gsap.fromTo(
        element,
        { y: from },
        {
          y: to,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );
    };
    // The experience label used to drift here to suggest standing still. It
    // is genuinely sticky now, in CSS, and a transform on top of that would
    // slide it back out of the alignment it holds.
    drift(".contact-atmosphere", ".contact", -60, 60);
    drift(".about-statement", ".principles", 46, -46);
  });
  return () => context.revert();
}
