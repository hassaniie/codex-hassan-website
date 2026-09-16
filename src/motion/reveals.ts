import { queryAll, type BehaviorContext, type Cleanup } from "../utilities/dom";
import { motionPresets } from "./presets";

export function initReveals({ reducedMotion }: BehaviorContext): Cleanup {
  const animations: Animation[] = [];
  const presets = motionPresets();
  if (reducedMotion) {
    document.body.classList.remove("motion-ready");
    return () => {};
  }
  document.body.classList.add("motion-ready");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in-view");
        sectionObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.08 },
  );
  queryAll(".reveal").forEach((element) => sectionObserver.observe(element));

  const textObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        queryAll(".char", entry.target).forEach((char, index) => {
          const animation = char.animate(
            [
              {
                opacity: 0.05,
                filter: "blur(6px)",
                transform: "translateY(10px)",
              },
              { opacity: 1, filter: "blur(0)", transform: "translateY(0)" },
            ],
            {
              duration: presets.textDuration,
              delay:
                index * presets.stagger +
                (entry.target.tagName === "H1" ? presets.heroDelay : 0),
              fill: "both",
              easing: presets.ease,
            },
          );
          animations.push(animation);
        });
        textObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.25 },
  );

  const headings = queryAll(".split-reveal");
  const originals = new Map<HTMLElement, string>();
  headings.forEach((element) => {
    originals.set(element, element.innerHTML);
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
    textObserver.observe(element);
  });
  return () => {
    sectionObserver.disconnect();
    textObserver.disconnect();
    animations.forEach((animation) => animation.cancel());
    originals.forEach((markup, element) => {
      element.innerHTML = markup;
      element.removeAttribute("aria-label");
    });
    document.body.classList.remove("motion-ready");
  };
}
