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
  const triggers: ScrollTrigger[] = [];
  const tweens: gsap.core.Tween[] = [];

  if (reducedMotion) {
    document.body.classList.remove("motion-ready");
    return () => {};
  }
  document.body.classList.add("motion-ready");

  queryAll(".split-reveal").forEach((element) => {
    originals.set(element, element.innerHTML);
    const chars = split(element);
    if (!chars.length) return;
    const from = {
      opacity: 0.04,
      filter: "blur(8px)",
      yPercent: 60,
      rotateX: -55,
      transformPerspective: 600,
      transformOrigin: "50% 100%",
    };
    const to = {
      opacity: 1,
      filter: "blur(0px)",
      yPercent: 0,
      rotateX: 0,
      ease: "none" as const,
    };
    if (element.tagName === "H1") {
      // Above the fold on load: a timed entrance, since there is no scroll yet.
      gsap.set(chars, from);
      tweens.push(
        gsap.to(chars, {
          ...to,
          ease: "power3.out",
          duration: presets.textDuration / 1000,
          delay: presets.heroDelay / 1000,
          stagger: presets.stagger / 1000,
        }),
      );
      return;
    }
    // Scroll drives the reveal, but it finishes well before the text exits.
    tweens.push(
      gsap.fromTo(chars, from, {
        ...to,
        stagger: presets.stagger / 1000,
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          end: "top 45%",
          scrub: 1.1,
        },
      }),
    );
  });

  queryAll(".reveal").forEach((element) => {
    tweens.push(
      gsap.fromTo(
        element,
        { opacity: 0, y: 64, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top 92%",
            end: "top 58%",
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
    triggers.forEach((trigger) => trigger.kill());
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
