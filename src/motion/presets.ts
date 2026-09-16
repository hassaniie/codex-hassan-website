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
    heroDelay: number("--motion-hero-delay-ms", 520),
    introDuration: number("--motion-intro-ms", 340),
    introExit: number("--motion-intro-exit-ms", 360),
    introEnter: number("--motion-intro-enter-ms", 380),
    revealDuration: number("--motion-reveal-ms", 1200),
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
  };
}
