# Hassan Mushtaq — portfolio

Milestone 1: an Astro + TypeScript foundation and the migrated homepage, preserving the existing portfolio design and local assets.

Use Node 24 (see `.nvmrc`). TypeScript is kept on 6.x for compatibility with the Astro checker.

## Run locally

```sh
npm ci
npm run dev
```

The development preview opens at http://127.0.0.1:4321/. The previous static preview at port 4173, when running, serves the latest `dist/` build.

## Validate and build

```sh
npm run check
npm run build
npm test
```

### Tuning the scroll feel

Every scroll value lives in `src/styles/tokens.css`, not in JavaScript:

- `--scroll-lerp` — lower is heavier and slower to settle (`0.075` is the current weight)
- `--scroll-wheel-multiplier` — distance travelled per wheel notch
- `--scroll-touch-sync` — set to `0` to hand phones back their native momentum
- `--scroll-anchor-ms` — how long an in-page anchor takes to travel

Entry blur is tuned separately, and deliberately stays near the viewport edge:

- `--motion-blur-reveal-px` / `--motion-blur-text-px` — how soft content is as it enters (`0` turns blur off)
- `--motion-blur-band` — how far into the screen, in viewport percent, blur may persist before it must be fully resolved
- `--motion-blur-exit-px` — the softening on the hero as it leaves

The opening curtain and the wipe between routes:

- `--motion-intro-ms` — how long the curtain holds before it starts lifting
- `--motion-intro-exit-ms` — the wipe that reveals the page
- `--motion-intro-enter-ms` — the wipe that covers the page when leaving for another route

The entrance uses one duration and one curve for every element, with the
choreography carried by a delay ladder:

- `--ease-appear` / `--motion-appear-ms` — the shared curve and duration
- `--motion-appear-step-ms` — the gap between rungs of the ladder
- `--motion-appear-rise` / `--motion-appear-drop` — how far content rises and the header drops
- `--motion-appear-hold-ms` — on a first load, when content starts arriving

A page change within the same session has no curtain: the ladder alone carries it.

The cursor dot has its own values:

- `--cursor-lerp` — follow weight; lower trails further behind the pointer
- `--cursor-magnet-radius` — how near a control has to be before it attracts the dot
- `--cursor-magnet-pull` — the furthest the dot is ever pulled off the pointer, in px

Reduced-motion visitors bypass all of it and get native scrolling.

`npm run preview` serves the built site. `npm run format` formats the source. The lockfile records the installed dependency versions.

## Where to edit

- `src/pages/index.astro` — homepage composition
- `src/content/` — profile, projects, principles, experience
- `src/components/` — reusable UI and homepage sections, with adjacent styles
- `src/styles/tokens.css` — shared design and motion values
- `src/motion/` and `src/scripts/` — browser interactions
- `src/motion/scenes/` — scroll-linked choreography per section
- `public/assets/` — images, fonts, font licenses, and resume

`dist/` is generated. Do not edit it directly. The original prototype source is preserved under `research/prototype-v1/`; its assets are retained in `public/assets/`.

See `docs/architecture.md` for ownership and boundaries. Case studies currently link to Behance; additional pages and publishing are outside this milestone.
