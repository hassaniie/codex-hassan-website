import { query, queryAll, type BehaviorContext } from "../utilities/dom";
import { lockScroll } from "../motion/smooth-scroll";

export function initNavigation({ signal }: BehaviorContext) {
  const menu = query<HTMLDialogElement>("#menu");
  const toggle = query<HTMLButtonElement>(".menu-toggle");
  if (!menu || !toggle) return () => {};
  toggle.addEventListener(
    "click",
    () => {
      menu.showModal();
      // The damped scroller keeps running behind a modal unless it is paused.
      lockScroll(true);
      toggle.setAttribute("aria-expanded", "true");
    },
    { signal },
  );
  query(".menu-close", menu)?.addEventListener("click", () => menu.close(), {
    signal,
  });
  menu.addEventListener(
    "close",
    () => {
      lockScroll(false);
      toggle.setAttribute("aria-expanded", "false");
    },
    { signal },
  );
  queryAll<HTMLAnchorElement>("nav a", menu).forEach((link) => {
    link.addEventListener("click", () => menu.close(), { signal });
  });
  return () => {
    if (menu.open) menu.close();
    lockScroll(false);
    toggle.setAttribute("aria-expanded", "false");
  };
}
