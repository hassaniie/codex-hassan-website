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

### Shared line reveal — 2026-10-07

Replaced the shared character-by-character scroll effect with masked whole-line
reveals for the About statement, Projects and Experience headings, and Contact
heading on every route using that component. Each line rises from 110% to zero
once at viewport entry, using the 650ms text duration, 80ms stagger and shared
entrance curve. Blur and rotation are absent from these text targets; section
wrappers containing them also skip edge blur. The hero retains its page-load
entrance and the case-study reading copy remains static during scrolling.

SplitText owns responsive/font remeasurement and preserves animation progress.
Observed About reflow: three desktop lines at 1280px, four phone lines at 390px,
then three again after resizing; completed lines retained zero translation.
Scrolling back out of view did not hide completed lines. The full text is
exposed through one accessible label; no character spans remain. Reduced-motion
emulation removed every mask, restored original text and ARIA state, and left
the text sharp. Temporary viewport and media overrides were reset.

Two layout adjustments support measuring actual lines: the About paragraph
keeps its original available flex width after splitting, and Contact's explicit
desktop line groups become inline at the existing 600px breakpoint. This
preserves two desktop Contact lines and three phone lines without a hidden
break forcing an artificial fourth line. Mask padding has compensating negative
margins, so serif clearance does not add paragraph line spacing.

Evidence: `research/motion/line-reveal/about-desktop.jpg` (1280 × 720),
`about-phone.jpg` (390 × 844) and `case-study-contact.jpg` (1280 × 720).
Settled headings have zero translation and no filter, complete readable glyphs,
and no horizontal overflow. The case footer also uses two completed line masks;
case story has none. Fresh post-fix browser warning/error logs were empty.

Astro check: 77 files, zero errors, warnings or hints. Build and all 13 existing
tests pass. No new P0/P1/P2 visual finding.

final result: passed

## Reader-focused case-study revision — 2026-10-07

This review supersedes the earlier hero scale, sticky guide, offset paragraphs,
portrait mobile cover and scroll-reveal decisions. The user's new intent is a
quick, useful first view followed by a calm, consistent reading path.

### Evidence and comparison target

Evidence folder: `research/energy-case-study/reader-layout/`.

- Source visual truth: `source-opening.png` and `source-story.png`, exact copies
  of the two user-supplied screenshots (2016 × 1246 pixels). Their original CSS
  viewport and density are unknown; no pixel-exact source-size claims are made.
- Implementation: `hero-wide.jpg` and `story-wide.jpg`, captured from the local
  `/works/clean-energy/` route at 2016 × 1246 CSS pixels, devicePixelRatio 1.
  These are intentional layout revisions, compared at equal raster dimensions.
- Additional captures: `hero-laptop.jpg` (1280 × 720), `hero-mobile.jpg`
  (390 × 844), `viewer-laptop.jpg` (1280 × 720), and
  `visual-language-wide.jpg` (2016 × 1246). All are browser-rendered JPEGs.
- States: fresh opening; first chapter after its anchor settles; visual-language
  chapter; fitted full-artwork dialog. Normal motion unless explicitly tested.
- Full-view evidence: each source and its revised capture were opened together
  in the same comparison input. The opening now presents the brief and complete
  dashboard, and the first chapter has one left edge instead of three alignments.
- Focused evidence: the visual-language capture shows the authentic benefit
  panels and adjacent explanatory copy; the viewer capture verifies that the
  complete original fits. Dashboard labels can be enlarged in the viewer.
  Source art was inspected in the preceding implementation review; no UI was
  redrawn. This is a layout change, not a redesign of the underlying dashboard.

### Findings and iteration history

1. **[P1, fixed] Opening withheld essential project context.** Source opening
   devotes most of the view to the headline while artwork and scope require
   scrolling. Added the challenge, contribution, specific design approach and
   exploration status beside a reduced heading and complete dashboard preview.
2. **[P1, fixed] Oversized artwork required scrolling through one preview.**
   Replaced the page-wide lead image with a bounded landscape preview on every
   device. Body evidence stays within an 800px column. The full-artwork viewer
   also fits the original by default; magnification is an explicit choice.
3. **[P2, fixed] Competing alignments interrupted reading.** Removed the sticky
   side guide, centred repeated question and duplicated principle summary.
   Short chapter links stay in flow; headings, copy and decisions share one
   left edge. At 1280px, all inspected story elements start at x=240px.
4. **[P2, fixed in iteration 2] Visible story text was faded.** Initial revised
   captures `hero-wide-iteration1.jpg` and `story-wide-iteration1.jpg` exposed
   scroll-scrub opacity on already visible paragraphs. Result remained blocked.
   Removed story reveals; entrance motion remains on the opening only.
   Post-fix captures `hero-wide.jpg` and `story-wide.jpg` show solid text.
   DOM checks report opacity 1 for all chapter headings, paragraphs and decisions.
5. **[P2, fixed in final pass] Copy could pass behind the fixed clock.** The new
   centred reading column intersects the transparent header while scrolling.
   A detail-route-only paper surface now separates navigation from content.
   Anchor verification: overview top 120.23px, heading top 152.18px; current
   chapter is `#overview`. Final `story-wide.jpg` confirms the separation.
6. **[P2, fixed during mobile pass] Opening preview reached beyond the fold.**
   The initial mobile spacing put the artwork bottom at 851.79px in an 844px
   viewport. Reduced phone heading and brief spacing through the existing
   600px breakpoint. Final preview including caption ends at 839.79px.

### Required fidelity surfaces

- **Typography:** Instrument Serif headings, Geist regular 14px copy and Geist
  Mono metadata retained. Modest chapter headings and a 44px phone hero support
  scanning; no new typeface or arbitrary viewport-only font override.
- **Spacing/layout:** 1280px maximum hero, 800px story and 640px copy widths are
  case tokens. The hero stacks at the existing 900px breakpoint; phone spacing
  tightens at 600px. Whole previews are visible and reading alignment is stable.
- **Colours/tokens:** existing #494FED, ink, paper, line and radius tokens.
  Shared Action hover, underline, icon and focus styling remain in use.
- **Image quality:** authentic responsive WebP assets retained, with the same
  calibrated performance and benefit crops. No fabricated assets or screenshots.
  Whole artwork uses object-fit containment; 2× zoom doubles both dimensions.
- **Copy/content:** short first-view answers replace repeated decorative copy.
  The page identifies the work as an interface exploration and keeps proposed
  validation in the future; it claims no measured research or business impact.

### Verification and remaining limits

- Checked desktop, laptop and phone layouts; no horizontal overflow.
- Chapter links settle below the header; current chapter follows the section
  nearest the top rather than an oversized viewport's arbitrary midpoint.
- Viewer opens with native dialog focus, closes with Escape and returns focus
  to its exact opener. At 1280 × 720, the unzoomed 1200 × 604 pane has no scroll
  overflow; 2× zoom produces a 2400 × 1208 scroll area.
- Reduced-motion emulation verified: preference true, story opacity 1 and no
  horizontal overflow. Temporary emulation and viewport overrides were reset.
- Browser warning/error logs: empty. Astro check: 75 files, zero errors,
  warnings or hints. Production build succeeds; all 10 built-output tests pass.
- The first-view answers and authentic preview are verified in static HTML,
  alongside existing chapter destinations, assets, semantics and metadata.
- No cross-browser certification or real recruiter usability study is claimed.

Implementation checklist: brief visible, complete previews, consistent reading
alignment, readable content throughout scrolling, viewer fit/zoom, keyboard
close/focus, responsive checks and existing build checks complete.

final result: passed

### Navbar follow-up — 2026-10-07

The user requested the site's transparent navbar. Removed the detail-route
paper background override; the shared header styles now own its appearance.
This supersedes finding 5's paper-surface decision above. Content passing beneath
the transparent fixed navbar is an accepted, user-requested visual behaviour.

Follow-up evidence: `research/energy-case-study/reader-layout/transparent-navbar.jpg`,
1280 × 720 CSS/pixels at density 1, opening view. Browser inspection confirms
`background-color: rgba(0, 0, 0, 0)`. The shared typography and content remain
visually consistent with the preceding review. No new P0/P1/P2 finding.

final result: passed

### Return navigation and entrance follow-up — 2026-10-07

Homepage and Works covers and CTAs now carry explicit entry context. The top
shared Action reads “Back home” and points to `/` for Home entries, or “All
works” and points to `/works/` for Works entries and direct visits. Both rollover
labels update together. Browser clicks verified both complete return journeys;
reload retained Home context. Direct entry had an empty referrer and the Works
fallback. Unit coverage checks legacy Home referrers, reloads, conflicting
referrers and invalid contexts without allowing arbitrary return destinations.

The chapter guide, story and closing actions now follow the existing entrance
ladder. They reuse the site's motion tokens and enter once, with no scroll-driven
fading of reading copy. Browser sampling immediately after reload reported
opacity 0.001 and a 32px rise for the heading, guide, body and closing actions;
after the sequence, all four had opacity 1 and zero translation. Reduced-motion
emulation reported body opacity 1, no transform and no armed curtain. Temporary
emulation was reset. Browser warning/error logs were empty.

Compared `transparent-navbar.jpg` and `return-home.jpg` together at 1280 × 720,
density 1. The accepted opening layout, typography, authentic artwork, palette
and transparent navbar remain consistent; only the contextual return label
changes. No breakpoint or layout-token changes were required. Source ownership
and behavior are documented in `docs/case-studies.md`.

Astro check: 77 files, zero errors, warnings or hints. Production build succeeds;
all 13 tests pass. No new P0/P1/P2 visual finding.

final result: passed
