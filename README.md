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

`npm run preview` serves the built site. `npm run format` formats the source. The lockfile records the installed dependency versions.

## Where to edit

- `src/pages/index.astro` — homepage composition
- `src/content/` — profile, projects, principles, experience
- `src/components/` — reusable UI and homepage sections, with adjacent styles
- `src/styles/tokens.css` — shared design and motion values
- `src/motion/` and `src/scripts/` — browser interactions
- `public/assets/` — images, fonts, font licenses, and resume

`dist/` is generated. Do not edit it directly. The original prototype source is preserved under `research/prototype-v1/`; its assets are retained in `public/assets/`.

See `docs/architecture.md` for ownership and boundaries. Case studies currently link to Behance; additional pages and publishing are outside this milestone.
