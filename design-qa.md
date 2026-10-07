# Design QA

Result: **passed for the adapted homepage prototype**.
Date: 2026-09-13
Preview: http://127.0.0.1:4173/
Reference: https://andreigorskikh.digital/

## Visual verification

Compared source and prototype desktop captures at 1728 × 998, with mobile review at 390 × 844. Screenshot evidence is in the browser tool outputs in this conversation; the tool did not expose saved file paths. Checked the gradient hero, centered serif statement, identity card, project rows, experience, contact, and mobile navigation.

The approved direction preserves the reference's atmospheric gradients, serif/mono typography, restrained header, character entrances, barcode geometry, identity interlude, and large project imagery. Hassan's portrait, HM artwork, copy, work, and experience replace source content. This is an adaptation, not a pixel or frame-accurate reproduction.

## Checks completed

- JavaScript syntax check passed.
- Local asset references resolve; all seven page images loaded successfully.
- No browser errors or warnings in the final desktop check.
- Desktop and mobile layouts have no horizontal overflow.
- Mobile menu opens and closes; Escape closes it and resets expanded state.
- Section navigation works.
- Email copy displays its confirmation; contact uses the supplied email address.
- Reduced-motion mode exposes content without entrance effects and causes no browser errors.
- Project links point to Hassan's published work; resume file is available locally.

## Corrections made

Centered the hero statement, restored the portrait's natural colors, corrected contact word spacing, improved header contrast transitions, fixed cancellation of repeating animations in reduced-motion mode, corrected font file extensions, added accessible labels for animated links, and compressed the generated token for delivery.

## Scope

Homepage only. Case studies currently open Behance. No invented outcomes, testimonials, or enterprise screenshots were added. The preview is local and has not been published. This check does not constitute a full accessibility audit or cross-browser certification.

## Milestone 1 — foundation migration (2026-09-14)

Migrated the homepage to Astro static output with TypeScript content, reusable components, semantic tokens, component-adjacent responsive CSS, and independently owned browser behaviors. The original source remains in `research/prototype-v1/`.

Matched layout measurements at 390 × 844 and 1280 × 720: hero, headline, identity card, principles grid, interlude, work, experience, contact, and footer preserve their original dimensions. Viewport-reveal transforms can temporarily offset bounding rectangles during animation. Compared browser captures against the original; no redesign was introduced. Corrected a mobile contact-label cascade ordering difference discovered during this check.

Verified mobile menu opening, Escape dismissal and expanded state, contact anchor navigation, clipboard confirmation, seven loaded images, no horizontal overflow, and live reduced-motion switching with no hidden content. Page console inspection returned no errors or warnings. Temporary browser emulation overrides were removed after testing. Screenshots and layout measurements are recorded in conversation tool outputs.

Astro diagnostics passed with zero errors, warnings, or hints. The first build and four output-integrity checks passed; final build/test results are recorded in the task tool outputs. TypeScript uses the compatible 6.x line because the installed Astro checker requires its programmatic API.

This remains a local homepage milestone. Later pages, case-study content, design additions, and publishing are deferred.

## Energy case study — 2026-10-07

Latest review scope: `/works/clean-energy/` on `codex-workin`, based on
`claude-finalized` at `6bafc03484737d0847cedd2caeafcc238838dae3`.

### Comparison target and evidence

The source visual target is the existing finalized portfolio, captured before
implementation in `research/energy-case-study/source-works.jpg`. The original
energy artwork is `public/assets/projects/energy-meadow-3000.webp`. This is a
new detail-page composition following that visual language, not a claim of
pixel equivalence between the Works listing and a case-study chapter.

Compared source and implementation images together in the same browser-tool
output: `source-works.jpg` and `overview-desktop.jpg`. Both are 1280 × 720
viewport captures at a 1280 × 720 CSS viewport; no density normalization was
needed. The headline scale and left-hand reading guide are intentional
extensions for long-form reading.

Additional full-view evidence:

- `research/energy-case-study/hero-desktop.jpg` — opening, 1280 × 720.
- `research/energy-case-study/overview-desktop.jpg` — settled overview anchor,
  1280 × 720, sticky guide and active chapter visible.
- `research/energy-case-study/hero-mobile.jpg` — phone opening, 390 × 844
  pixels at the same CSS viewport.
- `research/energy-case-study/viewer-mobile.jpg` — 2× artwork zoom and controls,
  390 × 844 pixels at the same CSS viewport.

Focused evidence: `performance-desktop.jpg` shows the performance crop beside
the reading guide. The full original artwork was inspected separately and
the actual crop boundaries were checked against its performance panel. This
checks the small dashboard labels that the opening capture cannot show.

### Findings, fixes and comparison history

1. **[P2, fixed] Chapter anchors reserved the header multiple times.** The
   initial overview capture landed around 300px below the top; the existing
   JS offset compounded Lenis's CSS padding and the new chapter margin.
   Removed the duplicate JS offset and made the case margin only the extra
   clearance. Fresh-load normal-motion verification landed the overview at
   119.92px, with `#overview` marked current. The revised
   `overview-desktop.jpg` is the post-fix evidence. Reduced-motion keyboard
   navigation also landed at approximately 120px.
2. **[P2, fixed] Performance crop included a strip of the next panel.** The
   initial 2.6 aspect ratio showed the environmental panels below the
   performance row. Adjusted the crop to 2.8 and aligned it to the original
   panel. The environmental detail uses its own 8.2 crop rather than a large
   empty band of meadow. Revised focused evidence: `performance-desktop.jpg`.
3. No further actionable P0/P1/P2 differences in the final comparison.

### Required fidelity surfaces

- **Typography:** existing Instrument Serif, Geist and Geist Mono assets;
  regular 14px body copy, 11px metadata, light case-study actions. Display
  typography intentionally scales up for the case hero. Mobile title wraps
  cleanly inside the 20px gutters.
- **Spacing/layout:** existing 24px desktop and 20px phone gutters; thin
  dividers, generous chapter gaps and offset body columns. Reading guide is
  sticky above 900px and flows above the story on smaller screens. Facts use
  four columns on desktop and two below 600px.
- **Colours/tokens:** existing `#494FED` accent, white surfaces and ink copy;
  component borders, radii and action states use shared tokens. No additional
  palette or button system introduced.
- **Imagery:** original meadow dashboard and responsive WebP set retained.
  Desktop crop and detail windows are intentional; phone cover shows the
  full portrait artwork. Full-resolution native viewer supports 2× zoom.
  No source UI was recreated or replaced with placeholder graphics.
- **Copy:** grounded in the project description and visible artwork. Scope
  explicitly reads interface exploration. Proposed validation is written as
  a next step; no research or business outcomes were invented.

### Interaction and integrity checks

- Homepage and Works cover/CTA route to this page in the same tab; other
  published projects retain their original Behance destinations.
- Chapter links and active state verified with mouse and keyboard; hashes
  and local targets are present in the built static HTML.
- Artwork viewer opens; native focus stays inside; 2× zoom sets the pressed
  state and doubles image width (700px inside a 350px mobile pane). Escape
  closes it and focus returns to the exact opening link.
- Shared mobile menu opens/closes; Escape restores expanded state.
- Reduced-motion preference was emulated: native scrolling, visible content,
  no entrance/reveal transforms or moving cursor. Temporary emulation removed.
- No horizontal page overflow at 1280 × 720 or 390 × 844.
- Browser console inspected: no errors or warnings on the case-study page.
- `npm run check`: zero errors, warnings or hints. Production build passes.
  All 10 built-output tests pass, including the existing homepage checks.

No deployment or cross-browser certification is claimed. Content beyond the
provided screen can be expanded when additional project material is supplied.

final result: passed
