import { query, type BehaviorContext, type Cleanup } from "../../utilities/dom";
import { gsap, setupEngine } from "../engine";
import { motionPresets } from "../presets";

/**
 * The interlude holds while the monogram turns through the viewer, replacing
 * the prototype's single rotation with a scrubbed sweep across a longer stage.
 */
export function initTokenScene({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  if (reducedMotion || !query(".identity-interlude")) return () => {};
  const presets = motionPresets();
  // Depth softening on the artwork only, at the extremes of its sweep.
  const soft = `blur(${presets.blurReveal}px) drop-shadow(0 35px 25px #1113)`;
  const sharp = "blur(0px) drop-shadow(0 35px 25px #1113)";
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
          filter: soft,
        },
        {
          rotateY: 0,
          rotateZ: 0,
          scale: 1.08,
          yPercent: 0,
          filter: sharp,
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
          filter: soft,
          ease: "none",
          duration: 0.5,
        },
        0.5,
      )
      // The sweep ends by dissolving into the gradient's white tail rather
      // than sliding off, so the section hands over instead of stopping.
      .to(".identity-token", { opacity: 0, ease: "none", duration: 0.22 }, 0.78)
      .fromTo(
        ".token-caption",
        { opacity: 0, y: 36, filter: `blur(${presets.blurText}px)` },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          duration: 0.22,
        },
        0.28,
      )
      .to(
        ".token-caption",
        { opacity: 0, y: -18, ease: "none", duration: 0.22 },
        0.78,
      );
    // The backdrop itself is deliberately not parallaxed. Its gradient runs
    // white-to-white with no margin (white at 0%, white again at 98%), and the
    // section is bordered by white above and below, so shifting it by any
    // amount crops a coloured band against a white neighbour at one edge or
    // the other. The monogram's sweep carries this section instead.
  });
  return () => context.revert();
}
