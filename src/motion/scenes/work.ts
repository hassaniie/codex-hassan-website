import {
  query,
  queryAll,
  type BehaviorContext,
  type Cleanup,
} from "../../utilities/dom";
import { gsap, setupEngine } from "../engine";

/**
 * Each case study gains depth: the story column travels gently against the
 * scroll. The cover itself stays still, so it is always drawn at its own
 * size and stays sharp.
 */
export function initWorkScene({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  if (reducedMotion) return () => {};
  const projects = queryAll(".project");
  if (!projects.length) return () => {};
  const context = gsap.context(() => {
    projects.forEach((project) => {
      const scrollTrigger = {
        trigger: project,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.15,
      };
      // A gentle counter-drift on the story, kept small because this column
      // carries the sticky description and the title must stay clear of the
      // header at reading position.
      const story = query(".project-story", project);
      if (story)
        gsap.fromTo(story, { y: 34 }, { y: -34, ease: "none", scrollTrigger });
      const bottom = query(".project-bottom", project);
      if (bottom)
        gsap.fromTo(bottom, { y: 44 }, { y: -18, ease: "none", scrollTrigger });
    });
  });
  return () => context.revert();
}
