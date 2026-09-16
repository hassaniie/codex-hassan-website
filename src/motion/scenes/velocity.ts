import {
  queryAll,
  type BehaviorContext,
  type Cleanup,
} from "../../utilities/dom";
import { gsap, setupEngine } from "../engine";
import { motionPresets } from "../presets";
import { getSmoothScroll } from "../smooth-scroll";

const TARGETS = ".project-media, .identity-card, .principle";

/**
 * Scroll speed bends the artwork slightly, then settles. The skew is damped
 * separately from the scroller so it trails the motion instead of tracking it.
 */
export function initVelocityScene({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  if (reducedMotion) return () => {};
  const targets = queryAll(TARGETS);
  if (!targets.length) return () => {};
  const presets = motionPresets();
  const limit = presets.velocitySkew;
  const setters = targets.map((element) =>
    gsap.quickSetter(element, "skewY", "deg"),
  );
  let current = 0;
  const tick = () => {
    const velocity = getSmoothScroll()?.velocity ?? 0;
    const target = gsap.utils.clamp(-limit, limit, velocity * 0.14);
    current += (target - current) * 0.12;
    if (Math.abs(current) < 0.002) current = 0;
    setters.forEach((set) => set(current));
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    targets.forEach((element) => gsap.set(element, { clearProps: "skewY" }));
  };
}
