/** CSS owns motion tokens; read them once when initializing an experience. */
export function motionPresets() {
  const styles = getComputedStyle(document.documentElement);
  const number = (name: string, fallback: number) =>
    parseFloat(styles.getPropertyValue(name)) || fallback;
  return {
    textDuration: number("--motion-text-ms", 700),
    stagger: number("--motion-stagger-ms", 12),
    heroDelay: number("--motion-hero-delay-ms", 950),
    introDuration: number("--motion-intro-ms", 1000),
    ease:
      styles.getPropertyValue("--ease-out").trim() ||
      "cubic-bezier(.2,.8,.2,1)",
  };
}
