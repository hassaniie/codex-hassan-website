# Hassan Mushtaq — reference lock

Approved primary source: https://andreigorskikh.digital/ (inspected 2026-09-13).
Scope: local homepage motion prototype, no publishing. Original content and assets for Hassan, closely adapted visual grammar. Individual case-study pages are a later phase; working links open Hassan's public case studies.

## Captured source traits

- Full-height atmospheric brown → orange → white opening. Centered, restrained serif statement between delicate brackets; floating translucent identity card below.
- Instrument Serif (48px/52.8px desktop hero, 32px smaller section title); Geist Mono for technical navigation, clocks and metadata. Font names confirmed through rendered DOM computed styles.
- Compact fixed navigation, personal photo, digital time display, rollover links, responsive menu overlay.
- Character-based blurred text entrance, animated numerical loader, barcode geometry, subtle cursor dot, scroll-led depth and identity token interlude.
- White principles section, centered serif statement, three outlined principle panels.
- Large orange Projects title; equal split image/detail project rows, tiny tags, case-study links, thin separators.
- Experience rows, large serif headings, reverse orange → brown atmospheric contact section.
- Mobile: 390×844 opening captured; stacked serif headline, compact identity card, single-column social links, compact menu. Project layout stacks.

## Decisions

| Decision                                                  | Source / rationale                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Instrument Serif + Geist Mono + Geist                     | Exact observed font pairing, openly available Google Fonts                     |
| White, #171819, orange #ed783e, brown #251209             | Observed reference color roles; orange large headings and atmospheric surfaces |
| Hero and closing atmospheric gradients                    | Source's central visual identity; retain rather than normalize to monochrome   |
| HM token, portrait, personal barcode                      | Original identity replaces the reference's identity                            |
| Public Behance project assets                             | Real work supplied via resume links; no invented enterprise interfaces         |
| Native scrolling, IntersectionObserver and Web Animations | Adapt visual effects with responsive, reduced-motion fallbacks                 |
| Resume + contact + real case-study links                  | Both employment and freelance audience                                         |

Do not reuse Andrei's copy, portrait, AG mark, awards, or testimonials. Do not claim identical timing; browser evidence verifies the visual vocabulary, not frame-accurate timing.

Generated asset: assets/hm-token.png, built-in ImageGen. Prompt: One matte-black circular sculptural identity token, gently tilted, raised polished silver square pixels spelling HM, subtle realistic texture, soft studio light and burnt-orange rim reflection, centered isolated cutout on genuinely transparent background, no other text or surroundings.

## Milestone 1 migration lock

The existing homepage is the visual target for the foundation migration. Preserve section order, gradients, fonts, artwork, image crops, copy, project destinations, and responsive composition. Structural decisions: Astro static output; typed content records; shared cards and UI; component-adjacent CSS; semantic tokens; modular, disposable browser behaviors. Additional pages and visual redesign remain deferred by the user's scope.

## September 14 — Hassan’s Figma revision

Reference: https://www.figma.com/design/67ywc56SaMnlhoylgS0UWc/Untitled?node-id=1-2
Accent overridden to #494FED as requested. Shared blue/lavender/white gradient mirrored for contact. Exact curve exported from node 12:101; HM mark exported from node 26:81, empty right-hand canvas cropped from 158 to 65 units without changing paths. Hero navigation simplified to Contact me. Scroll tabs use reversible smoothstep progress over 240px, disabled for reduced motion.
