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

  // Blocks arrive the way headings do: a short fade and rise that plays
  // once as they come into view, then stays put.
  queryAll(".reveal").forEach((element) => {
    tweens.push(
      gsap.fromTo(
        element,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
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
