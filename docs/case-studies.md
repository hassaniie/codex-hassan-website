# Case studies

The first local detail page is `/works/clean-energy/`, built on `codex-workin`
from `origin/claude-finalized`. Its project cover and CTA both use that route
on the homepage and Works page. Existing Behance destinations remain external.
Internal cover and CTA links carry `?from=home` or `?from=works`. The top action
returns Home arrivals to `/`; Works arrivals and direct visits return to
`/works/`. This explicit context survives reloads and new tabs, while canonical
metadata retains the clean detail URL. Legacy links can use a same-origin Home
referrer; unrecognised contexts use Works. Without JavaScript, the static
Works link remains usable.

## Ownership

- `src/content/case-studies/energy.ts`: narrative, chapter order, opening brief and
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

The opening pairs a concise project brief with the entire dashboard: challenge,
contribution, approach and an honest exploration status are available before the
long-form story. The hero caps at 1280px; the story caps at 800px, with 640px
left-aligned copy. Images use landscape windows on every device, so no preview
requires scrolling through a portrait cover. Readers can open the original
artwork for closer inspection.

The chapter guide stays in document flow. It offers four short jump links,
without a second sticky reading track. The navbar retains the site's transparent
background. Repeated questions, principle summaries
and a large closing headline were removed. Each chapter follows the same
heading → explanation → evidence rhythm.

Above 900px, the hero uses two columns; below that existing site breakpoint it
stacks. Below 600px, tighter spacing and a 44px heading keep the complete
preview and brief within the tested 390×844 first view. These are responsive
component decisions, not a fixed layout for the user's screenshot dimensions.

Chapter links respect CSS scroll padding and margin. Current Lenis already
reads both, so the additional JS offset was removed to avoid counting the
navbar twice. Native and damped scrolling now share the same clearance.

The native artwork dialog traps focus, closes with Escape, pauses the shared
scroller and returns focus to its opener. The full artwork fits inside the viewer
by default. Zoom preserves the inspected area
and allows native horizontal and vertical scrolling. Without JavaScript,
artwork links open the original asset and the full story remains in the HTML.
Reduced motion disables entrances, reveals, cursor movement and atmosphere
drift while preserving navigation and the viewer. The opening, chapter guide,
story and closing actions arrive on the shared entrance ladder, using the
existing duration, delay, rise and easing tokens. After that single entrance,
story copy stays fully visible throughout scrolling.

## Content provenance

The original energy project description and meadow artwork on
`claude-finalized` are the source material. The detail copy describes visible
design decisions and possible next steps. No client, timeline, research
participant count, shipped result or measured improvement was invented.
Artwork is reused intact through CSS crops; no dashboard UI was redrawn.

## Verification

Run `npm run check`, `npm run build`, then `npm test`. The built-output checks
cover both entry points, local chapter destinations, artwork fallbacks,
dialog semantics, metadata, sitemap inclusion and return-context fallbacks.
Browser evidence and the
visual comparison history are recorded in `design-qa.md` and
`research/energy-case-study/`.
