import { queryAll, type BehaviorContext, type Cleanup } from "../utilities/dom";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  CustomEase,
  setupEngine,
} from "./engine";
import { motionPresets } from "./presets";

export function initReveals({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  const presets = motionPresets();
  const splits: SplitText[] = [];
  const tweens: gsap.core.Tween[] = [];

  if (reducedMotion) {
    document.body.classList.remove("motion-ready");
    return () => {};
  }
  document.body.classList.add("motion-ready");
  const textEase = CustomEase.create(
    "word-reveal",
    presets.easeAppear.replace(/cubic-bezier\(|\)/g, ""),
  );

  /**
   * Blur runs on its own short trigger rather than alongside the travel, so
   * it is a softening as content clears the edge of the viewport instead of a
   * veil that follows it well into the page. It resolves within
   * --motion-blur-band percent of the viewport and is skipped at zero.
   */
  const edgeBlur = (
    targets: HTMLElement[],
    trigger: HTMLElement,
    amount: number,
    stagger: number,
  ) => {
    if (amount <= 0 || !targets.length) return;
    tweens.push(
      gsap.fromTo(
        targets,
        { filter: `blur(${amount}px)` },
        {
          filter: "blur(0px)",
          ease: "none",
          stagger,
          // A resting blur(0px) still routes the element through a filter
          // pass, which Safari draws at reduced resolution: images and text
          // in it stay soft. Drop the filter once it has resolved; scrolling
          // back re-renders the tween and brings the blur back as needed.
          onComplete: () => gsap.set(targets, { filter: "none" }),
          scrollTrigger: {
            trigger,
            start: "top 99%",
            end: `top ${Math.max(40, 99 - presets.blurBand)}%`,
            scrub: 0.6,
          },
        },
      ),
    );
  };

  queryAll(".split-reveal").forEach((element) => {
    // The hero headline belongs to the entrance now: it arrives as one
    // element on the shared curve rather than character by character.
    if (element.tagName === "H1") return;
    splits.push(
      SplitText.create(element, {
        type: "words",
        wordsClass: "reveal-word",
        // Inline words reflow naturally with fonts and viewport changes.
        // Returning the tween lets SplitText own animation cleanup.
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { y: presets.textRise, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: presets.textDuration / 1000,
              stagger: presets.stagger / 1000,
              ease: textEase,
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            },
          );
        },
      }),
    );
  });

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
    // Split text must remain sharp even inside an animated section wrapper.
    if (!element.querySelector(".split-reveal"))
      edgeBlur([element], element, presets.blurReveal, 0);
  });

  ScrollTrigger.refresh();

  return () => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    splits.forEach((split) => split.revert());
    queryAll(".reveal").forEach((element) =>
      gsap.set(element, { clearProps: "all" }),
    );
    document.body.classList.remove("motion-ready");
  };
}
