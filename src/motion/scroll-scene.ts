import { query, type BehaviorContext, type Cleanup } from "../utilities/dom";

export function initScrollScene({
  signal,
  reducedMotion,
}: BehaviorContext): Cleanup {
  const header = query(".site-header");
  const hero = query(".hero");
  const contact = query(".contact");
  const interlude = query(".identity-interlude");
  const token = query(".identity-token");
  if (!header || !hero || !contact || !interlude || !token) return () => {};
  const card = query(".identity-card");
  let frame = 0;
  const update = () => {
    frame = 0;
    const opening = hero.getBoundingClientRect();
    const closing = contact.getBoundingClientRect();
    const stage = interlude.getBoundingClientRect();
    // Match header contrast to the shared blue atmosphere.
    const dark =
      opening.bottom > opening.height * 0.58 ||
      (stage.top < 0 && stage.bottom > stage.height * 0.25) ||
      closing.top < -closing.height * 0.45;
    header.dataset.theme = dark ? "dark" : "light";
    const tabProgress = reducedMotion
      ? 0
      : Math.max(0, Math.min(1, -opening.top / 240));
    const eased = tabProgress * tabProgress * (3 - 2 * tabProgress);
    card?.style.setProperty("--tab-progress", String(eased));
    if (reducedMotion || stage.bottom <= 0 || stage.top >= innerHeight) return;
    const progress = Math.max(
      0,
      Math.min(1, (innerHeight - stage.top) / (innerHeight + stage.height)),
    );
    const offset = progress - 0.5;
    token.style.transform = `perspective(1000px) rotateY(${offset * 40}deg) rotateZ(${offset * -24}deg) translateY(${offset * -60}px)`;
  };
  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener("scroll", requestUpdate, { signal, passive: true });
  window.addEventListener("resize", requestUpdate, { signal, passive: true });
  update();
  return () => {
    cancelAnimationFrame(frame);
    token.style.removeProperty("transform");
    card?.style.removeProperty("--tab-progress");
  };
}
