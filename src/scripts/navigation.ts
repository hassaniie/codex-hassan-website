import { query, queryAll, type BehaviorContext } from "../utilities/dom";
import { lockScroll } from "../motion/smooth-scroll";
import { gsap } from "../motion/engine";
import { motionPresets } from "../motion/presets";

/**
 * The phone menu opens with show(), not showModal(), so the navbar stays
 * above it and its toggle doubles as the close control. What a modal would
 * give for free is supplied here: Escape closes it, and the page behind is
 * inert so focus cannot wander under the curtain.
 *
 * Opening is one timeline: the curtain drops, then each link rises from
 * behind its own underline and the location settles in. Closing plays that
 * timeline backwards, a little faster, so a tap mid-way simply turns it
 * around.
 */
export function initNavigation({ signal, reducedMotion }: BehaviorContext) {
  const menu = query<HTMLDialogElement>("#menu");
  const toggle = query<HTMLButtonElement>(".menu-toggle");
  const header = query(".site-header");
  if (!menu || !toggle || !header) return () => {};
  const behind = [query("main"), query(".skip-link")].filter(
    (element): element is HTMLElement => element !== null,
  );
  const tracks = queryAll(".action-track", menu);
  const bottom = query(".menu-bottom", menu);
  const settling = bottom ? [...tracks, bottom] : tracks;
  let timeline: gsap.core.Timeline | undefined;

  const setExpanded = (expanded: boolean) => {
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute(
      "aria-label",
      expanded ? "Close navigation" : "Open navigation",
    );
  };
  // Runs synchronously, so a link's own scroll finds the page unlocked.
  const finish = () => {
    timeline?.kill();
    timeline = undefined;
    gsap.set(settling, { clearProps: "transform,opacity" });
    menu.style.removeProperty("clip-path");
    menu.classList.remove("is-moving");
    if (menu.open) menu.close();
    header.classList.remove("is-menu-open");
    behind.forEach((element) => (element.inert = false));
    lockScroll(false);
    setExpanded(false);
  };
  const build = () => {
    const presets = motionPresets();
    const curtain = { progress: 0 };
    // The navbar turns dark as the curtain's edge passes behind it, not
    // before, so it never shows dark on the hero's blue.
    const render = () => {
      menu.style.clipPath = `inset(0 0 ${(1 - curtain.progress) * 100}% 0)`;
      const bar = toggle.getBoundingClientRect();
      header.classList.toggle(
        "is-menu-open",
        curtain.progress * menu.clientHeight > bar.top + bar.height / 2,
      );
    };
    return gsap
      .timeline({
        paused: true,
        // At rest the links hand their transform back to the CSS roll.
        onComplete: () => {
          menu.classList.remove("is-moving");
          gsap.set(tracks, { clearProps: "transform" });
        },
        onReverseComplete: finish,
      })
      .to(curtain, {
        progress: 1,
        duration: presets.menuDrop / 1000,
        ease: "power3.inOut",
        onUpdate: render,
      })
      // Explicit y, so a focused link's CSS roll isn't folded into the rise.
      .fromTo(
        tracks,
        { y: 0, yPercent: 105 },
        {
          y: 0,
          yPercent: 0,
          duration: presets.menuRise / 1000,
          ease: "power3.out",
          stagger: presets.menuStagger / 1000,
        },
        0.35,
      )
      .from(
        bottom ?? [],
        { opacity: 0, y: 12, duration: 0.5, ease: "power2.out" },
        "-=0.5",
      );
  };
  const open = () => {
    if (!menu.open) {
      menu.show();
      query(".menu-body", menu)?.scrollTo(0, 0);
      // The damped scroller keeps running behind the menu unless it is paused.
      lockScroll(true);
      behind.forEach((element) => (element.inert = true));
    }
    setExpanded(true);
    if (reducedMotion) {
      menu.style.clipPath = "none";
      header.classList.add("is-menu-open");
      return;
    }
    menu.classList.add("is-moving");
    timeline ??= build();
    timeline.timeScale(1).play();
  };
  const close = (instant = false) => {
    if (instant || !timeline) return finish();
    setExpanded(false);
    menu.classList.add("is-moving");
    timeline.timeScale(motionPresets().menuCloseRate).reverse();
  };

  toggle.addEventListener(
    "click",
    () => (toggle.getAttribute("aria-expanded") === "true" ? close() : open()),
    { signal },
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && menu.open) close();
    },
    { signal },
  );
  // A destination closes at once, so an anchor scrolls straight away and a
  // route hands over to the page curtain.
  queryAll<HTMLAnchorElement>("nav a", menu).forEach((link) => {
    link.addEventListener("click", () => close(true), { signal });
  });
  return finish;
}
