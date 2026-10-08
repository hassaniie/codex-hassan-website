import { queryAll, type BehaviorContext, type Cleanup } from "../utilities/dom";
import { gsap, ScrollTrigger, setupEngine } from "./engine";
import { cascade } from "./text-cascade";

export function initReveals({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  const tweens: gsap.core.Tween[] = [];

  if (reducedMotion) {
    document.body.classList.remove("motion-ready");
    return () => {};
  }
  document.body.classList.add("motion-ready");

  // Page headlines (h1) cascade on the entrance ladder instead.
  const cascades = queryAll(".text-cascade")
    .filter((element) => element.tagName !== "H1")
    .map((element) => cascade(element, { scroll: true }));

  queryAll(".reveal").forEach((element) => {
    tweens.push(
      gsap.fromTo(
        element,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top 92%",
            end: "top 62%",
            scrub: 1.1,
          },
        },
      ),
    );
  });

  ScrollTrigger.refresh();

  return () => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    cascades.forEach((revert) => revert());
    queryAll(".reveal").forEach((element) =>
      gsap.set(element, { clearProps: "all" }),
    );
    document.body.classList.remove("motion-ready");
  };
}
