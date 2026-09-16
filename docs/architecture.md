# Portfolio foundation — milestone 1

The authored homepage is now an Astro page composed of reusable components. Astro produces static HTML in `dist/`; the browser receives real page content before JavaScript runs. TypeScript handles content contracts and small behavior modules. There is no client framework runtime, database, CMS, or server API. Two motion libraries are the only runtime dependencies: Lenis damps the scroll position and GSAP ScrollTrigger binds animation to it.

## Ownership

| Location                        | Responsibility                                                       |
| ------------------------------- | -------------------------------------------------------------------- |
| `src/pages/index.astro`         | Homepage section order                                               |
| `src/layouts/SiteLayout.astro`  | HTML document, metadata, shared header, site behavior entry          |
| `src/components/sections/`      | Hero, principles, identity scene, selected work, experience, contact |
| `src/components/portfolio/`     | Reusable identity, project, principle, and experience components     |
| `src/components/ui/`            | Rollover links, social links, barcode, intro                         |
| `src/components/navigation/`    | Header, mobile dialog, footer                                        |
| `src/content/`                  | Typed profile, project, experience, and principle data               |
| `src/styles/`                   | Tokens, fonts, base rules, shared primitives, motion defaults        |
| `src/motion/`                   | Intro, reveals, cursor, damped scrolling, shared motion settings     |
| `src/motion/scenes/`            | Scroll-linked choreography per section, composed by one orchestrator |
| `src/motion/page-transition.ts` | The wipe that covers a route change                                  |
| `src/scripts/`                  | Site/homepage lifecycles, navigation, clock, clipboard               |
| `public/assets/`                | Original local images, fonts, licenses, and resume                   |
| `tests/`                        | Built-output integrity checks                                        |
| `research/prototype-v1/`        | Preserved original HTML/CSS/JS for comparison                        |

## Editing rules

Edit `src/` and `public/`, never the generated `dist/`. Update project content in `src/content/projects.ts`; the shared card renders all projects. Add a shared design value to `tokens.css` only when it has a recurring semantic role. Keep one-off gradient recipes and art positioning within the owning section. Component CSS is global by deliberate class namespace; it is co-located, not CSS Modules. Responsive rules live beside the component they modify.

The root CSS tokens define color roles, font families, body/metadata sizes, spacing, radii, layers, and motion settings. JavaScript reads the numeric motion settings from CSS so animation timing has one owner; the `--scroll-*` tokens own the scroll feel, and `--scroll-touch-sync: 0` returns phones to native momentum without touching any module. Existing small metadata and art-specific pixel sizes are preserved in this migration; an accessibility/design revision can reconsider them later.

Lenis drives the real scroll position rather than transforming a wrapper, so `position: sticky`, the native scrollbar, and anchor targets keep working. Scenes never animate a class or attribute that the built-output tests assert on. Each behavior initializer owns its listeners, timers, animation frames, and observers. The site and homepage entries dispose their owned behavior before reinitializing, including when reduced-motion preferences change or development code reloads. Barcodes are rendered at build time. Text stays visible when JavaScript is unavailable.

## Deliberate scope boundaries

Only the homepage route exists. The project links still open Behance. Dedicated case studies, additional pages, advanced 3D, CMS editing, final SEO/social cards, and publishing belong to later milestones. The intro is a decorative timed sequence and holds the scroller until its curtain clears. It is shell behavior, so every route opens the same way, though the count itself belongs to arriving at the site: a navigation within the same session gets the curtain without it, and an inline script arms it before first paint so content never flashes ahead of it; that script opts out entirely under reduced motion and drops its class on a timer, so a bundle that never runs cannot leave the page hidden. A page change is covered by the same curtain, without the count: it closes over the departing page, the next document loads behind it, and the content then re-enters on the same delay ladder, which keeps the change continuous without introducing a client router. The cursor dot is an accent over the native pointer rather than a replacement for it, damped to trail the pointer and drawn with difference blending so it stays visible on any background; it is hidden on touch layouts and under reduced motion. The HM scene remains a transformed image, now swept in three dimensions across a taller stage rather than rendered in WebGL. Header contrast retains the prototype's gradient thresholds; it now expresses its result with a themed data attribute.

The approved visual source remains `research/reference-lock.md`. This milestone migrates the established composition rather than introducing a new design.
