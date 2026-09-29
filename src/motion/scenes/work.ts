import {
  query,
  queryAll,
  type BehaviorContext,
  type Cleanup,
} from "../../utilities/dom";
import { gsap, setupEngine } from "../engine";

/**
 * Each case study gains depth: the artwork drifts slower than the frame that
 * crops it, and the story column travels against both. Parallax writes a
 * custom property so the card's own hover scale keeps its CSS transition.
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
      // The frame drifts, not the image, and on whole pixels only: a
      // fractional offset makes the browser resample the cover every frame.
      const frame = query(".project-media-frame", project);
      if (frame) {
        const drift = { y: -58 };
        const write = () =>
          frame.style.setProperty("--parallax-y", `${Math.round(drift.y)}px`);
        gsap.to(drift, { y: 58, ease: "none", onUpdate: write, scrollTrigger });
        write();
      }
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
  return () => {
    context.revert();
    queryAll(".project-media-frame").forEach((frame) =>
      frame.style.removeProperty("--parallax-y"),
    );
  };
}
