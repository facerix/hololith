<div style="text-align: center"><img src="images/splash.png" alt="Hololith logo" /></div>

# Hololith

Hololith is a low-resolution, top-down tactical wargame simulator — a 40k-adjacent system that uses army roster data from `personnel` as its source material without leaning on GW-protected naming.

## Architecture

- **No frameworks, no bundler** - Pure vanilla TypeScript compiled with `tsc` to ES modules
- **Web Components** - Custom elements in `/components/` with Shadow DOM
- **Data Store** - Singleton `DataStore` (EventTarget) manages all data in localStorage
- **DOM Creation** - Use `h()` helper from `src/domUtils.ts` for all DOM manipulation
- **Service Workers** - Offline-first caching with automatic update notifications (authored in plain JS, not compiled)

## Requirements

- **Node 24+** (see `.nvmrc`). Tests run TypeScript directly via Node's built-in type stripping, which is on by default in Node 24.

## Setup

```sh
pnpm install
git config core.hooksPath .githooks
```

This activates pre-commit hooks that run lint and format checks before each commit.

## Development

### Commands

- **`pnpm start` / `pnpm dev`** — runs three concurrent processes: `tsc --watch`, a chokidar asset-copy watcher, and live-server on port 8080 serving `dist/`
- **`pnpm build`** — one-shot `tsc` build + asset copy into `dist/`
- **`pnpm typecheck`** — type-check src and tests without emitting
- **`pnpm test`** — typecheck + run `node --test` against `.ts` files
- **`pnpm lint` / `pnpm lint:fix`** — oxlint
- **`pnpm format` / `pnpm format:check`** — prettier

### How the build works

`tsc` reads source from the repo root (`index.ts`, `about.ts`, `src/**`, `components/**`) and emits compiled `.js` into `dist/` (preserving the tree). `scripts/copy-assets.mjs` copies all static files (HTML, CSS, manifest, icons, service workers) into `dist/`. `live-server` serves `dist/` as the web root, so the absolute import paths in source (`/src/foo.js`, `/components/Foo.js`) resolve correctly.

Service workers (`sw.js`, `sw-dev.js`, `sw-core.js`) are **not** compiled by `tsc` — they're hand-authored classic-worker JavaScript and are copied verbatim into `dist/`.

## Coding Standards

- **TypeScript** - `strict: true`, `verbatimModuleSyntax: true`, `moduleResolution: "bundler"`
- **ES modules** - Always use `import`/`export`. Import paths use the `.js` extension (compiled output), e.g. `import { h } from '/src/domUtils.js'`. The test files are the one exception — they import `.ts` directly so Node can run them without a build step.
- **Private fields** - Use `#fieldName` for encapsulation
- **const > let** - Prefer `const`, avoid `var`
- **Arrow functions** - For callbacks
- **async/await** - For promises
