# CLAUDE.md

Hololith is a low-resolution, top-down tactical wargame simulator — a 40k-adjacent system that uses army roster data from `personnel` as its source material without leaning on GW-protected naming.

## Domain

**Core constraint:** Player interaction at the unit level; simulation geometry at the model level. Units move as a single object; the engine maintains individual model/base positions internally for LOS, cover, coherency, and collision.

**Key sim concepts:**
- `UnitTemplate` — static definition built from army data (statlines, weapons, abilities)
- `UnitState` — runtime state: wounds, flags, position anchor
- `ModelState` — per-model base position for geometry/visibility
- `WeaponProfile` — typed weapon attributes (not free text)
- `AbilityEffect` — typed engine-readable behavior, not prose
- `BattleState` — turn, phase, board objects, score, action queue
- `TerrainPiece`, `ObjectiveState` — board geometry and scoring

**Movement model:** Player drags a destination; engine computes anchor; resolver auto-places individual bases into a legal formation (coherency, collision, terrain). Player adjusts manually only when auto-placement is ambiguous.

**v0.1 scope:** movement, LOS/range, cover/blocking terrain, shooting, charge+melee, objective control, curated ability subset. Transports, reserves, deep strike, mixed base sizes, attached leaders are deferred.

**Prose metadata is UI only.** Ability descriptions from `personnel` are display strings. Engine logic requires typed `AbilityEffect` structures.

## Coding Standards

See `AGENTS.md` for the full coding patterns, naming conventions, component patterns, and checklist.

- No frameworks. No `createElement`. Use `h()` from `domUtils.ts`.
- Always absolute import paths in app source (e.g. `/src/domUtils.js`).
- `DataStore` localStorage key is `'hololith'`.
- Service worker cache prefix is `hololith-cache-`.

## Dev Server

```bash
pnpm start   # tsc --watch + asset-copy watcher + live-server on :8080
```
