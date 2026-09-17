import {
  query,
  queryAll,
  type BehaviorContext,
  type Cleanup,
} from "../utilities/dom";
import { ScrollTrigger, setupEngine } from "../motion/engine";

/**
 * The category filter on the works page. The row is inert markup until this
 * runs and marks it ready, so a document without JavaScript shows the whole
 * list and no control that cannot do anything.
 */
export function initWorksFilter({ signal }: BehaviorContext): Cleanup {
  const row = query(".works-filter");
  if (!row) return () => {};
  const chips = queryAll<HTMLButtonElement>("button[data-category]", row);
  const projects = queryAll<HTMLElement>(".project");
  const count = query(".works-count");
  if (!chips.length || !projects.length) return () => {};
  setupEngine();

  const apply = (category: string) => {
    let shown = 0;
    projects.forEach((project) => {
      const owned = (project.dataset.categories ?? "").split("|");
      const match = !category || owned.includes(category);
      project.hidden = !match;
      if (match) shown += 1;
    });
    chips.forEach((chip) =>
      chip.setAttribute(
        "aria-pressed",
        String(chip.dataset.category === category),
      ),
    );
    if (count) count.textContent = `(${String(shown).padStart(2, "0")})`;
    // Every card carries a scrubbed trigger measured against the page height.
    // Hiding one changes that height, so the rest have to be re-measured or
    // they stay pinned to a layout that no longer exists.
    ScrollTrigger.refresh();
  };

  chips.forEach((chip) =>
    chip.addEventListener("click", () => apply(chip.dataset.category ?? ""), {
      signal,
    }),
  );
  row.dataset.ready = "true";

  return () => {
    delete row.dataset.ready;
    projects.forEach((project) => {
      project.hidden = false;
    });
    if (count) count.textContent = `(${count.dataset.total ?? ""})`;
  };
}
