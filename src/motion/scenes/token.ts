import { query, type BehaviorContext, type Cleanup } from "../../utilities/dom";
import { gsap, setupEngine } from "../engine";

/**
 * The interlude holds while the monogram turns through the viewer, replacing
 * the prototype's single rotation with a scrubbed sweep across a longer stage.
 */
export function initTokenScene({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  if (reducedMotion || !query(".identity-interlude")) return () => {};
  const context = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".identity-interlude",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });
    timeline
      .fromTo(
        ".identity-token",
        {
          transformPerspective: 1200,
          rotateY: -46,
          rotateZ: 22,
          scale: 0.8,
          yPercent: 14,
          filter: "blur(5px) drop-shadow(0 35px 25px #1113)",
        },
        {
          rotateY: 0,
          rotateZ: 0,
          scale: 1.08,
          yPercent: 0,
          filter: "blur(0px) drop-shadow(0 35px 25px #1113)",
          ease: "none",
          duration: 0.55,
        },
        0,
      )
      .to(
        ".identity-token",
        {
          rotateY: 44,
          rotateZ: -21,
          scale: 0.84,
          yPercent: -14,
          filter: "blur(5px) drop-shadow(0 35px 25px #1113)",
          ease: "none",
          duration: 0.45,
        },
        0.55,
      )
      .fromTo(
        ".token-caption",
        { opacity: 0, y: 36, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          duration: 0.22,
        },
        0.3,
      );
    // The backdrop itself is deliberately not parallaxed. Its gradient runs
    // white-to-white with no margin (white at 0%, white again at 98%), and the
    // section is bordered by white above and below, so shifting it by any
    // amount crops a coloured band against a white neighbour at one edge or
    // the other. The monogram's sweep carries this section instead.
  });
  return () => context.revert();
}
