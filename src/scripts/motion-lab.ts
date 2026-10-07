import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { initCursor } from "../motion/cursor";
import { gsap, ScrollTrigger, setupEngine } from "../motion/engine";
import { queryAll } from "../utilities/dom";

/*
 * The motion lab: one candidate per section, each run on the same real
 * headings. Every candidate but "today" plays once as its text comes into
 * view, and Replay restarts the section.
 */

type Play = () => gsap.core.Animation;

/**
 * Splits a heading and returns its entrance. autoSplit re-splits on resize
 * and swaps in a new animation, so callers ask for the current one.
 */
const candidates: Record<string, (element: HTMLElement) => Play> = {
  lines: (element) => {
    let animation: gsap.core.Animation | undefined;
    SplitText.create(element, {
      type: "lines",
      linesClass: "lab-line",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) => {
        animation = gsap.from(self.lines, {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.08,
          paused: true,
        });
        return animation;
      },
    });
    return () => animation!;
  },
  words: (element) => {
    let animation: gsap.core.Animation | undefined;
    SplitText.create(element, {
      type: "words",
      wordsClass: "word",
      autoSplit: true,
      onSplit: (self) => {
        animation = gsap.from(self.words, {
          opacity: 0,
          yPercent: 45,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.04,
          paused: true,
        });
        return animation;
      },
    });
    return () => animation!;
  },
  chars: (element) => {
    let animation: gsap.core.Animation | undefined;
    SplitText.create(element, {
      type: "words,chars",
      wordsClass: "word",
      charsClass: "char",
      autoSplit: true,
      onSplit: (self) => {
        animation = gsap.from(self.chars, {
          opacity: 0,
          yPercent: 40,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.012,
          paused: true,
        });
        return animation;
      },
    });
    return () => animation!;
  },
};

/** Today's reveal, as reveals.ts runs it, for reference. */
function today(element: HTMLElement) {
  const split = SplitText.create(element, {
    type: "words,chars",
    wordsClass: "word",
    charsClass: "char",
  });
  gsap.fromTo(
    split.chars,
    {
      opacity: 0.04,
      yPercent: 60,
      rotateX: -55,
      transformPerspective: 600,
      transformOrigin: "50% 100%",
    },
    {
      opacity: 1,
      yPercent: 0,
      rotateX: 0,
      ease: "none",
      stagger: 0.02,
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        end: "top 50%",
        scrub: 1.1,
      },
    },
  );
}

function decode(element: HTMLElement): Play {
  const text = element.textContent?.trim() ?? "";
  element.setAttribute("aria-label", text);
  const animation = gsap.to(element, {
    duration: 1,
    ease: "none",
    paused: true,
    scrambleText: {
      text,
      chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      revealDelay: 0.25,
      speed: 0.6,
    },
  });
  return () => animation;
}

export async function initMotionLab() {
  setupEngine();
  gsap.registerPlugin(SplitText, ScrambleTextPlugin);
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  initCursor({
    signal: new AbortController().signal,
    reducedMotion: preference.matches,
  });
  if (preference.matches) return;
  // Lines are measured, so wait for the real fonts first.
  await document.fonts.ready;

  queryAll("[data-lab-option]").forEach((section) => {
    const kind = section.dataset.labOption!;
    const texts = queryAll("[data-lab-text]", section);
    if (kind === "today") {
      texts.forEach(today);
      return;
    }
    const plays: Play[] = [];
    if (kind === "decode")
      queryAll("[data-lab-label]", section).forEach((label) =>
        plays.push(decode(label)),
      );
    else texts.forEach((text) => plays.push(candidates[kind](text)));

    // Each piece plays once as it comes into view.
    const pieces =
      kind === "decode" ? queryAll("[data-lab-label]", section) : texts;
    pieces.forEach((piece, index) =>
      ScrollTrigger.create({
        trigger: piece,
        start: "top 85%",
        once: true,
        onEnter: () => plays[index]().play(),
      }),
    );
    section
      .querySelector("[data-lab-replay]")
      ?.addEventListener("click", () =>
        plays.forEach((play) => play().restart()),
      );
  });
  ScrollTrigger.refresh();
}
