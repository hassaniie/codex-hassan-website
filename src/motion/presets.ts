/** CSS owns motion tokens; read them once when initializing an experience. */
export function motionPresets() {
  const styles = getComputedStyle(document.documentElement);
  // Finite-checked so a deliberate 0 (an off switch) survives the read.
  const number = (name: string, fallback: number) => {
    const parsed = parseFloat(styles.getPropertyValue(name));
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  return {
    textDuration: number("--motion-text-ms", 900),
    stagger: number("--motion-stagger-ms", 20),
    introDuration: number("--motion-intro-ms", 2000),
    introExit: number("--motion-intro-exit-ms", 500),
    introQuick: number("--motion-intro-quick-ms", 220),
    introEnter: number("--motion-intro-enter-ms", 380),
    revealDuration: number("--motion-reveal-ms", 1200),
    appearDuration: number("--motion-appear-ms", 500),
    appearStep: number("--motion-appear-step-ms", 100),
    appearRise: number("--motion-appear-rise", 32),
    appearDrop: number("--motion-appear-drop", -48),
    appearHold: number("--motion-appear-hold-ms", 2000),
    blurReveal: number("--motion-blur-reveal-px", 2.5),
    blurText: number("--motion-blur-text-px", 2.5),
    blurExit: number("--motion-blur-exit-px", 3),
    blurBand: number("--motion-blur-band", 13),
    scrollLerp: number("--scroll-lerp", 0.075),
    scrollWheel: number("--scroll-wheel-multiplier", 0.9),
    scrollTouchSync: number("--scroll-touch-sync", 1) === 1,
    scrollTouchLerp: number("--scroll-touch-lerp", 0.075),
    scrollTouchMultiplier: number("--scroll-touch-multiplier", 1.1),
    scrollTouchInertia: number("--scroll-touch-inertia", 1.9),
    anchorDuration: number("--scroll-anchor-ms", 1500),
    headerOffset: number("--scroll-anchor-offset", 90),
    velocitySkew: number("--scroll-velocity-skew", 4),
    cursorLerp: number("--cursor-lerp", 0.16),
    cursorMagnetRadius: number("--cursor-magnet-radius", 70),
    cursorMagnetPull: number("--cursor-magnet-pull", 14),
    ease:
      styles.getPropertyValue("--ease-out").trim() ||
      "cubic-bezier(.2,.8,.2,1)",
    easeAppear:
      styles.getPropertyValue("--ease-appear").trim() ||
      "cubic-bezier(.12,.23,.5,1)",
  };
}

/** True once this session has already played the full opening. */
export const quickCurtain = () =>
  document.documentElement.classList.contains("intro-quick");

/**
 * When content starts arriving, in seconds. A first load waits for the
 * curtain to clear; an in-session arrival has no curtain, so it starts at
 * once and the ladder alone carries the choreography.
 */
export function entranceDelay() {
  const presets = motionPresets();
  return quickCurtain()
    ? (presets.introQuick + presets.introExit * 0.5) / 1000
    : presets.appearHold / 1000;
}
