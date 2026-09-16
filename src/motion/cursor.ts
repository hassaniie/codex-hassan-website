import { query, type BehaviorContext, type Cleanup } from "../utilities/dom";
import { gsap, setupEngine } from "./engine";
import { motionPresets } from "./presets";

const INTERACTIVE = "a[href], button:not([disabled])";
/** Probe count per ring; more points detect controls sooner. */
const PROBES = 8;
/**
 * Probe radii as fractions of the magnet radius. A single ring straddles small
 * controls: its points land beyond a short link while the pointer sits just
 * outside it, so the magnet drops out exactly as you approach. Several rings
 * close that gap.
 */
const RINGS = [0.34, 0.67, 1];
/** Hit testing flushes layout, so the magnet resolves at a quarter of the rate. */
const MAGNET_INTERVAL = 4;

export function initCursor({
  signal,
  reducedMotion,
}: BehaviorContext): Cleanup {
  setupEngine();
  const dot = query(".cursor-dot");
  if (!dot || reducedMotion) return () => {};
  const presets = motionPresets();
  const { cursorLerp: ease, cursorMagnetRadius: radius } = presets;
  const maxPull = presets.cursorMagnetPull;

  gsap.set(dot, { xPercent: -50, yPercent: -50 });
  const setX = gsap.quickSetter(dot, "x", "px");
  const setY = gsap.quickSetter(dot, "y", "px");

  let pointerX = 0;
  let pointerY = 0;
  let pullX = 0;
  let pullY = 0;
  let currentX = 0;
  let currentY = 0;
  let live = false;
  let frames = 0;

  // Concentric probes around the pointer, so a control attracts the dot shortly
  // before the pointer arrives rather than only once it is inside. Each ring is
  // rotated against the last so the points interleave instead of lining up.
  const ring: [number, number][] = [];
  RINGS.forEach((scale, index) => {
    for (let i = 0; i < PROBES; i++) {
      const angle = ((i + index / RINGS.length) / PROBES) * Math.PI * 2;
      ring.push([
        Math.cos(angle) * radius * scale,
        Math.sin(angle) * radius * scale,
      ]);
    }
  });

  const magnet = () => {
    let closest: DOMRect | undefined;
    let closestDistance = Infinity;
    const consider = (node: Element | null) => {
      const target = node?.closest?.(INTERACTIVE);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Distance to the nearest edge, so large controls are not under-weighted.
      const nearestX = Math.max(rect.left, Math.min(pointerX, rect.right));
      const nearestY = Math.max(rect.top, Math.min(pointerY, rect.bottom));
      const distance = Math.hypot(nearestX - pointerX, nearestY - pointerY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = rect;
      }
    };
    consider(document.elementFromPoint(pointerX, pointerY));
    for (const [dx, dy] of ring)
      consider(document.elementFromPoint(pointerX + dx, pointerY + dy));

    if (!closest) {
      pullX = 0;
      pullY = 0;
      return;
    }
    const strength = Math.max(0, 1 - closestDistance / radius);
    let dx = (closest.left + closest.width / 2 - pointerX) * strength;
    let dy = (closest.top + closest.height / 2 - pointerY) * strength;
    const magnitude = Math.hypot(dx, dy);
    if (magnitude > maxPull) {
      dx = (dx / magnitude) * maxPull;
      dy = (dy / magnitude) * maxPull;
    }
    pullX = dx;
    pullY = dy;
  };

  const tick = () => {
    if (!live) return;
    if (frames++ % MAGNET_INTERVAL === 0) magnet();
    // Damped follow: the dot carries weight instead of tracking the pointer
    // one to one, which is what made it read as a second arrow.
    currentX += (pointerX + pullX - currentX) * ease;
    currentY += (pointerY + pullY - currentY) * ease;
    setX(currentX);
    setY(currentY);
  };
  gsap.ticker.add(tick);

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!live) {
        // Start under the pointer so the dot never flies in from the corner.
        live = true;
        currentX = pointerX;
        currentY = pointerY;
        setX(currentX);
        setY(currentY);
        dot.style.opacity = "1";
      }
    },
    { signal, passive: true },
  );
  document.addEventListener(
    "mouseleave",
    () => {
      dot.style.opacity = "0";
    },
    { signal },
  );
  document.addEventListener(
    "mouseenter",
    () => {
      if (live) dot.style.opacity = "1";
    },
    { signal },
  );

  return () => {
    gsap.ticker.remove(tick);
    dot.style.opacity = "0";
    gsap.set(dot, { clearProps: "all" });
  };
}
