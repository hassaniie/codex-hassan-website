import Lenis from "lenis";
import { gsap, ScrollTrigger, setupEngine } from "./engine";
import { motionPresets } from "./presets";
import type { BehaviorContext, Cleanup } from "../utilities/dom";

let instance: Lenis | null = null;
let locked = false;

/** Scenes, navigation, and the intro share one damped scroller. */
export const getSmoothScroll = () => instance;

/**
 * Pause damping while a modal or the intro owns the viewport. The request is
 * remembered, so a caller that runs before the scroller exists still applies.
 */
export function lockScroll(value: boolean) {
  locked = value;
  if (!instance) return;
  if (value) instance.stop();
  else instance.start();
}

export function initSmoothScroll({
  signal,
  reducedMotion,
}: BehaviorContext): Cleanup {
  setupEngine();
  const presets = motionPresets();
  if (reducedMotion) {
    // Native scrolling is the accessible baseline; scenes stand down too.
    document.documentElement.classList.remove("lenis");
    return () => {};
  }

  const lenis = new Lenis({
    lerp: presets.scrollLerp,
    wheelMultiplier: presets.scrollWheel,
    smoothWheel: true,
    syncTouch: presets.scrollTouchSync,
    syncTouchLerp: presets.scrollTouchLerp,
    touchMultiplier: presets.scrollTouchMultiplier,
    touchInertiaExponent: presets.scrollTouchInertia,
    autoRaf: false,
    anchors: false,
  });
  instance = lenis;
  if (locked) lenis.stop();

  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);

  // Same-document hashes must ride the damped scroller, not the native jump.
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const link = (event.target as Element | null)?.closest?.("a[href]");
    if (!(link instanceof HTMLAnchorElement) || link.target === "_blank")
      return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname)
      return;
    if (!url.hash || url.hash === "#") return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target as HTMLElement, {
      offset: -presets.headerOffset,
      duration: presets.anchorDuration / 1000,
    });
    // Keep the keyboard where the eye lands.
    if (target instanceof HTMLElement) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
    history.pushState(null, "", url.hash);
  };
  document.addEventListener("click", onClick, { signal });

  // Focus moved by keyboard must not teleport past the damped position.
  const onFocusIn = (event: FocusEvent) => {
    const node = event.target;
    if (!(node instanceof HTMLElement)) return;
    const box = node.getBoundingClientRect();
    if (box.top >= presets.headerOffset && box.bottom <= innerHeight) return;
    lenis.scrollTo(node, { offset: -presets.headerOffset, duration: 0.8 });
  };
  document.addEventListener("focusin", onFocusIn, { signal });

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh, { signal });

  return () => {
    gsap.ticker.remove(tick);
    lenis.off("scroll", onScroll);
    lenis.destroy();
    if (instance === lenis) instance = null;
  };
}
