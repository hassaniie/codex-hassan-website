import { query, type BehaviorContext, type Cleanup } from "../../utilities/dom";
import { gsap, setupEngine } from "../engine";
import { motionPresets } from "../presets";

/**
 * The one horizontal moment on a page that otherwise only travels down: the
 * section is pinned for its own length and the scroll is spent driving the
 * rail sideways instead. It reads as a process moving forward rather than as
 * a list being scrolled.
 *
 * Whether it runs at all is Process.css's decision, read back through
 * --motion-process-pin. Touch, narrow layouts and reduced motion get a native
 * swipe rail from CSS alone, and this scene stands down for all of them.
 */
export function initProcessScene({ reducedMotion }: BehaviorContext): Cleanup {
  setupEngine();
  const presets = motionPresets();
  if (reducedMotion || !presets.processPin) return () => {};
  const section = query(".process");
  const viewport = query(".process-viewport");
  const track = query(".process-track");
  if (!section || !viewport || !track) return () => {};
  const fill = query(".process-rule span", section);
  const count = query(".process-count", section);
  const steps = track.children.length;
  if (!steps) return () => {};

  /*
   * Taking the rail over from the native scroller. Anything already scrolled
   * there has to go back to the start, or the clip would hide the distance
   * the track is about to travel.
   */
  viewport.scrollLeft = 0;
  section.classList.add("is-pinned");

  const context = gsap.context(() => {
    /*
     * Measured against the viewport, not the track: the track is laid out at
     * max-content width, so its own clientWidth is its scrollWidth and would
     * report no distance to travel at all.
     */
    const travel = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    gsap.to(track, {
      x: () => -travel(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        // The pin lasts exactly as long as the rail is wide, so the last
        // panel lands flush with the gutter as the section releases.
        end: () => `+=${travel()}`,
        pin: true,
        // Without this the pin engages a frame late on a damped scroller,
        // which shows up as a jolt at the moment it takes hold.
        anticipatePin: 1,
        scrub: presets.processScrub,
        // reveals.ts and smooth-scroll.ts both refresh; the distance has to
        // be remeasured then rather than kept from first layout.
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (fill) gsap.set(fill, { scaleX: self.progress });
          if (!count) return;
          const at = Math.min(steps, Math.floor(self.progress * steps) + 1);
          count.textContent = `(${String(at).padStart(2, "0")} / ${String(steps).padStart(2, "0")})`;
        },
      },
    });
  }, section);

  return () => {
    context.revert();
    section.classList.remove("is-pinned");
  };
}
