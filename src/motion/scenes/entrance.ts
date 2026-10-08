import {
  query,
  queryAll,
  type BehaviorContext,
  type Cleanup,
} from "../../utilities/dom";
import { gsap, setupEngine } from "../engine";
import { entranceDelay, motionPresets } from "../presets";
import { cascade } from "../text-cascade";

/**
 * The opening, matched to the reference build. Every element shares one
 * duration and one curve; the choreography is a ladder of 0.1s delays rather
 * than a stagger inside any one element. Each element fades from 0.001 and
 * travels a single axis: content rises, the header drops. Nothing scales,
 * rotates or blurs, which is what keeps it quiet.
 *
 * A first load waits for the curtain; an in-session arrival starts at once,
 * so the same ladder doubles as the page-change animation.
 */
export function initEntrance({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  if (reducedMotion) return () => {};
  const presets = motionPresets();
  const base = entranceDelay();
  const step = presets.appearStep / 1000;
  const duration = presets.appearDuration / 1000;
  const ease = `cubic-bezier(${presets.easeAppear.replace(/cubic-bezier\(|\)/g, "")})`;

  // [selector, rung on the ladder, travel] — content first, header last,
  // which is the order the reference uses.
  const score: [string, number, { y?: number; x?: number }][] = [
    [".hero h1", 0, { y: presets.appearRise }],
    [".identity-card", 1, { y: presets.appearRise }],
    [".hero-bottom > *", 2, { y: presets.appearRise }],
    [".site-header", 5, { y: presets.appearDrop }],
    // Contact and privacy: the first screen arrives on the same ladder.
    [".contact-page-hero h1", 0, { y: presets.appearRise }],
    [".contact-page-hero .down-cue", 2, { y: presets.appearRise }],
    [".policy-head > *", 0, { y: presets.appearRise }],
    [".policy-body", 2, { y: presets.appearRise }],
    [".not-found-copy > *", 0, { y: presets.appearRise }],
    [".works .display-heading > *", 0, { y: presets.appearRise }],
    [".case-eyebrow", 0, { y: presets.appearRise }],
    [".case-hero-brief > *", 1, { y: presets.appearRise }],
    [".case-hero .case-figure", 2, { y: presets.appearRise }],
    [".case-guide", 4, { y: presets.appearRise }],
  ];

  // Headlines take their rung as a word cascade rather than a rise.
  const cascades: Cleanup[] = [];
  const context = gsap.context(() => {
    score.forEach(([selector, rung, travel]) => {
      const targets = queryAll(selector);
      if (!targets.length) return;
      targets.forEach((target, index) => {
        const delay = base + (rung + index) * step;
        if (target.matches(".text-cascade")) {
          cascades.push(cascade(target, { delay }));
          return;
        }
        gsap.fromTo(
          target,
          { opacity: 0.001, ...travel },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration,
            ease,
            delay,
          },
        );
      });
    });
  });
  return () => {
    context.revert();
    cascades.forEach((revert) => revert());
  };
}

/** The hero headline is part of the entrance, so reveals leaves it alone. */
export const heroHeadline = () => query(".hero h1");
