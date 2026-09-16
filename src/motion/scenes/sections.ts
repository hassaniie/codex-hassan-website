import {
  query,
  queryAll,
  type BehaviorContext,
  type Cleanup,
} from "../../utilities/dom";
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
    // The standing label holds while its rows travel past it.
    drift(".experience-label", ".experience", 70, -70);
    drift(".contact-atmosphere", ".contact", -60, 60);
    drift(".about-statement", ".principles", 46, -46);

    // Principle cards arrive on a stagger rather than all at once.
    const cards = queryAll(".principle");
    if (cards.length)
      gsap.fromTo(
        cards,
        { y: 88, rotateX: -12, transformPerspective: 900 },
        {
          y: 0,
          rotateX: 0,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".principle-grid",
            start: "top 95%",
            end: "top 45%",
            scrub: 1.1,
          },
        },
      );
  });
  return () => context.revert();
}
