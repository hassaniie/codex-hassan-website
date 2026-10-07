import { queryAll, type BehaviorContext, type Cleanup } from "../utilities/dom";
import { gsap, ScrollTrigger, setupEngine } from "./engine";
import { motionPresets } from "./presets";

/** Split a heading into per-character spans, preserving its accessible text. */
function split(element: HTMLElement) {
  const text = element.innerText.replace(/\s+/g, " ").trim();
  element.setAttribute("aria-label", text);
  element.replaceChildren();
  text.split(/\s+/).forEach((word, index) => {
    if (index) element.append(document.createTextNode(" "));
    const span = document.createElement("span");
    span.className = "word";
    span.setAttribute("aria-hidden", "true");
    for (const character of word) {
      const char = document.createElement("span");
      char.className = "char";
      char.textContent = character;
      span.append(char);
    }
    element.append(span);
  });
  return queryAll(".char", element);
}

export function initReveals({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  const presets = motionPresets();
  const originals = new Map<HTMLElement, string>();
  const tweens: gsap.core.Tween[] = [];

  if (reducedMotion) {
    document.body.classList.remove("motion-ready");
    return () => {};
  }
  document.body.classList.add("motion-ready");

  queryAll(".split-reveal").forEach((element) => {
    // The hero headline belongs to the entrance now: it arrives as one
    // element on the shared curve rather than character by character.
    if (element.tagName === "H1") return;
    originals.set(element, element.innerHTML);
    const chars = split(element);
    if (!chars.length) return;
    const from = {
      opacity: 0.04,
      yPercent: 60,
      rotateX: -55,
      transformPerspective: 600,
      transformOrigin: "50% 100%",
    };
    const to = { opacity: 1, yPercent: 0, rotateX: 0, ease: "none" as const };
    // Scroll drives the reveal, but it finishes well before the text exits.
    tweens.push(
      gsap.fromTo(chars, from, {
        ...to,
        stagger: presets.stagger / 1000,
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          end: "top 50%",
          scrub: 1.1,
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
  });

  ScrollTrigger.refresh();

  return () => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    originals.forEach((markup, element) => {
      gsap.set(element, { clearProps: "all" });
      element.innerHTML = markup;
      element.removeAttribute("aria-label");
    });
    queryAll(".reveal").forEach((element) =>
      gsap.set(element, { clearProps: "all" }),
    );
    document.body.classList.remove("motion-ready");
  };
}
