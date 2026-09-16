import { queryAll, type BehaviorContext, type Cleanup } from "../utilities/dom";
import { gsap, ScrollTrigger, setupEngine } from "./engine";
import { entranceDelay, motionPresets } from "./presets";

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
    if (element.tagName === "H1") {
      // Above the fold on load: a timed entrance, since there is no scroll yet.
      gsap.set(chars, from);
      tweens.push(
        gsap.to(chars, {
          ...to,
          ease: "power3.out",
          duration: presets.textDuration / 1000,
          delay: entranceDelay(),
          stagger: presets.stagger / 1000,
        }),
      );
      if (presets.blurText > 0) {
        gsap.set(chars, { filter: `blur(${presets.blurText}px)` });
        tweens.push(
          gsap.to(chars, {
            filter: "blur(0px)",
            ease: "power3.out",
            duration: presets.textDuration / 1000,
            delay: entranceDelay(),
            stagger: presets.stagger / 1000,
          }),
        );
      }
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
          end: "top 50%",
          scrub: 1.1,
        },
      }),
    );
    edgeBlur(chars, element, presets.blurText, presets.stagger / 2000);
  });

  queryAll(".reveal").forEach((element) => {
    tweens.push(
      gsap.fromTo(
        element,
        { opacity: 0, y: 64 },
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
    edgeBlur([element], element, presets.blurReveal, 0);
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
