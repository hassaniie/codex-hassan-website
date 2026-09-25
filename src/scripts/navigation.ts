import { query, queryAll, type BehaviorContext } from "../utilities/dom";
import { lockScroll } from "../motion/smooth-scroll";

/** How far down the screen the curtain's edge is, in px. */
function curtainEdge(menu: HTMLElement) {
  const inset = getComputedStyle(menu).clipPath.match(/inset\(([^)]*)\)/);
  if (!inset) return menu.clientHeight;
  const sides = inset[1].trim().split(/\s+/);
  const bottom = sides[2] ?? sides[0];
  const clipped = bottom.endsWith("%")
    ? (parseFloat(bottom) / 100) * menu.clientHeight
    : parseFloat(bottom);
  return menu.clientHeight - clipped;
}

/**
 * The phone menu opens with show(), not showModal(), so the navbar stays
 * above it and its toggle doubles as the close control. What a modal would
 * give for free is supplied here: Escape closes it, and the page behind is
 * inert so focus cannot wander under the curtain.
 */
export function initNavigation({ signal }: BehaviorContext) {
  const menu = query<HTMLDialogElement>("#menu");
  const toggle = query<HTMLButtonElement>(".menu-toggle");
  const header = query(".site-header");
  if (!menu || !toggle || !header) return () => {};
  const behind = [query("main"), query(".skip-link")].filter(
    (element): element is HTMLElement => element !== null,
  );
  let frame = 0;

  const setExpanded = (expanded: boolean) => {
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute(
      "aria-label",
      expanded ? "Close navigation" : "Open navigation",
    );
  };
  // The navbar turns dark as the curtain's edge passes behind it, not before,
  // so it never shows dark on the hero's blue.
  const followCurtain = () => {
    cancelAnimationFrame(frame);
    const step = () => {
      const bar = toggle.getBoundingClientRect();
      const middle = bar.top + bar.height / 2;
      header.classList.toggle(
        "is-menu-open",
        menu.open && curtainEdge(menu) > middle,
      );
      frame = menu.getAnimations().length ? requestAnimationFrame(step) : 0;
    };
    step();
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
    // One frame at the closed inset first, so the curtain has somewhere to
    // drop from.
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        menu.classList.add("is-open");
        followCurtain();
      });
    });
  };
  // Runs synchronously, so a link's own scroll finds the page unlocked.
  const finish = () => {
    cancelAnimationFrame(frame);
    if (menu.open) menu.close();
    menu.classList.remove("is-open");
    header.classList.remove("is-menu-open");
    behind.forEach((element) => (element.inert = false));
    lockScroll(false);
    setExpanded(false);
  };
  // Lifts the curtain; the dialog itself closes once it has cleared.
  const close = (instant = false) => {
    setExpanded(false);
    menu.classList.remove("is-open");
    // No lift to wait for when motion is reduced (transitions are off) or the
    // curtain never started dropping.
    if (instant || !menu.getAnimations().length) finish();
    else followCurtain();
  };

  toggle.addEventListener(
    "click",
    () => (menu.classList.contains("is-open") ? close() : open()),
    { signal },
  );
  menu.addEventListener(
    "transitionend",
    (event) => {
      if (event.target !== menu || event.propertyName !== "clip-path") return;
      if (!menu.classList.contains("is-open")) finish();
    },
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
