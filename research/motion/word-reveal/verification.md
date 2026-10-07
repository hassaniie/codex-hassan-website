# Word reveal trial — 2026-10-07

Replaces the shared line reveals on the existing `.split-reveal` targets.
Whole words rise 14px and fade in over 450ms, with a 50ms stagger, using the
shared entrance curve. ScrollTrigger plays once at viewport entry. Hero entrance,
block motion and static case-study paragraphs keep their separate behavior.

Browser checks at 1280 × 720 and 390 × 844:

- About has 22 word targets; Contact has 15. Projects and Experience each have
  one. The hero has no word targets, and no line masks remain.
- Before entry: word opacity 0 and translation 14px. After completion: every
  About word has opacity 1, zero translation and no blur/filter.
- About's complete accessible label remains intact. Reduced motion removes
  word wrappers, restores original markup/ARIA and leaves the text readable.
- Phone resize preserves completed word visibility and reflows naturally:
  four About lines, three Contact lines, no horizontal overflow.
- Temporary viewport and media overrides were reset. Warning/error logs empty.
- Compared the previous line-reveal desktop capture with `about-desktop.jpg`:
  the settled typography, layout, colour and statement alignment are preserved.
- Astro check: 77 files, zero errors/warnings/hints. Build succeeds; 13 tests pass.

Evidence: `about-desktop.jpg` and `about-phone.jpg`. These show the settled
appearance; the live homepage preview demonstrates the sequential animation.
