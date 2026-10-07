import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

/** One registration point so every scene shares a single plugin instance. */
export function setupEngine() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
    // Lenis drives the frame loop; lag smoothing would fight it.
    gsap.ticker.lagSmoothing(0);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger, SplitText, CustomEase };
