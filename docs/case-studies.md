# Case studies

The first local detail page is `/works/clean-energy/`, built on `codex-workin`
from `origin/claude-finalized`. Its project cover and CTA both use that route
on the homepage and Works page. Existing Behance destinations remain external.

## Ownership

- `src/content/case-studies/energy.ts`: narrative, chapter order, facts and
  full-resolution artwork. The project title, year, cover and tags still come
  from `src/content/projects.ts`.
- `src/pages/works/clean-energy.astro`: composition and route metadata.
- `src/components/case-study/`: hero, chapter, reading guide, figure and artwork
  viewer. Components accept content through props; the two detail crops are
  specifically calibrated to the energy artwork.
- `src/components/case-study/case-study.css`: responsive editorial layout.
  Shared typography, colours, radii, action states and spacing use the existing
  tokens. Case-specific display, heading, spacing and reading widths live in
  `src/styles/tokens.css`.
- `src/scripts/case-study-page.ts`: active chapter, artwork viewer, 2× zoom and
  lifecycle cleanup. It reuses the shared cursor, reveals and contact motion.

## Design and behaviour

Instrument Serif leads; Geist body copy is 14px; Geist Mono handles metadata
and actions. The page retains the site's white ground, `#494FED` accent,
thin rules, generous space, shared header, curtain entrance and contact footer.
All new controls use `Action.astro`, including viewer controls.

Above 900px, the reading guide sticks at the case offset. On smaller screens
it moves into the document flow. Below 600px, the facts become two columns,
the narrative is a single column, and the hero shows the original portrait
cover rather than the desktop landscape crop. These follow existing site
breakpoints, not an annotation-specific viewport.

Chapter links respect CSS scroll padding and margin. Current Lenis already
reads both, so the additional JS offset was removed to avoid counting the
navbar twice. Native and damped scrolling now share the same clearance.

The native artwork dialog traps focus, closes with Escape, pauses the shared
scroller and returns focus to its opener. Zoom preserves the inspected area
and allows native horizontal and vertical scrolling. Without JavaScript,
artwork links open the original asset and the full story remains in the HTML.
Reduced motion disables entrances, reveals, cursor movement and atmosphere
drift while preserving navigation and the viewer.

## Content provenance

The original energy project description and meadow artwork on
`claude-finalized` are the source material. The detail copy describes visible
design decisions and possible next steps. No client, timeline, research
participant count, shipped result or measured improvement was invented.
Artwork is reused intact through CSS crops; no dashboard UI was redrawn.

## Verification

Run `npm run check`, `npm run build`, then `npm test`. The built-output checks
cover both entry points, local chapter destinations, artwork fallbacks,
dialog semantics, metadata and sitemap inclusion. Browser evidence and the
visual comparison history are recorded in `design-qa.md` and
`research/energy-case-study/`.
