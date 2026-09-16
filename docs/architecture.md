# Portfolio foundation — milestone 1

The authored homepage is now an Astro page composed of reusable components. Astro produces static HTML in `dist/`; the browser receives real page content before JavaScript runs. TypeScript handles content contracts and small behavior modules. There is no client framework runtime, database, CMS, or server API in this milestone.

## Ownership

| Location                       | Responsibility                                                       |
| ------------------------------ | -------------------------------------------------------------------- |
| `src/pages/index.astro`        | Homepage section order                                               |
| `src/layouts/SiteLayout.astro` | HTML document, metadata, shared header, site behavior entry          |
| `src/components/sections/`     | Hero, principles, identity scene, selected work, experience, contact |
| `src/components/portfolio/`    | Reusable identity, project, principle, and experience components     |
| `src/components/ui/`           | Rollover links, social links, barcode, intro                         |
| `src/components/navigation/`   | Header, mobile dialog, footer                                        |
| `src/content/`                 | Typed profile, project, experience, and principle data               |
| `src/styles/`                  | Tokens, fonts, base rules, shared primitives, motion defaults        |
| `src/motion/`                  | Intro, reveals, cursor, scroll scene, shared motion settings         |
| `src/scripts/`                 | Site/homepage lifecycles, navigation, clock, clipboard               |
| `public/assets/`               | Original local images, fonts, licenses, and resume                   |
| `tests/`                       | Built-output integrity checks                                        |
| `research/prototype-v1/`       | Preserved original HTML/CSS/JS for comparison                        |

## Editing rules

Edit `src/` and `public/`, never the generated `dist/`. Update project content in `src/content/projects.ts`; the shared card renders all projects. Add a shared design value to `tokens.css` only when it has a recurring semantic role. Keep one-off gradient recipes and art positioning within the owning section. Component CSS is global by deliberate class namespace; it is co-located, not CSS Modules. Responsive rules live beside the component they modify.

The root CSS tokens define color roles, font families, body/metadata sizes, spacing, radii, layers, and motion settings. JavaScript reads the numeric motion settings from CSS so animation timing has one owner. Existing small metadata and art-specific pixel sizes are preserved in this migration; an accessibility/design revision can reconsider them later.

Each behavior initializer owns its listeners, timers, animation frames, and observers. The site and homepage entries dispose their owned behavior before reinitializing, including when reduced-motion preferences change or development code reloads. Barcodes are rendered at build time. Text stays visible when JavaScript is unavailable.

## Deliberate scope boundaries

Only the homepage route exists. The project links still open Behance. Dedicated case studies, additional pages, advanced 3D, CMS editing, final SEO/social cards, and publishing belong to later milestones. The intro is a decorative timed sequence. The HM scene remains a transformed image. Header contrast retains the prototype's gradient thresholds; it now expresses its result with a themed data attribute.

The approved visual source remains `research/reference-lock.md`. This milestone migrates the established composition rather than introducing a new design.
