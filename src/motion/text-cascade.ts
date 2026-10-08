import { SplitText } from "gsap/SplitText";
import { gsap, setupEngine } from "./engine";

/**
 * The site's heading motion: words fade in and rise a little, one after
 * another, and it plays once. Headlines that open a page run it on the
 * entrance ladder (a delay); every other heading runs it as it scrolls into
 * view (a ScrollTrigger). SplitText keeps the heading's accessible text whole.
 */
export function cascade(
  element: HTMLElement,
  timing: { delay: number } | { scroll: true },
) {
  setupEngine();
  gsap.registerPlugin(SplitText);
  const split = SplitText.create(element, {
    type: "words",
    wordsClass: "word",
  });
  const animation = gsap.from(split.words, {
    opacity: 0,
    yPercent: 45,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.04,
    ...("delay" in timing
      ? { delay: timing.delay }
      : {
          scrollTrigger: { trigger: element, start: "top 85%", once: true },
        }),
  });
  return () => {
    animation.scrollTrigger?.kill();
    animation.kill();
    split.revert();
  };
}
