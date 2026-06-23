# Hololith v0.1

## Intent

Hololith is a new app direction for a low-resolution, top-down tactical wargame simulator.

The target is not a rules-perfect licensed Warhammer 40,000 implementation. The target is a tactically recognizable, 40k-adjacent system that uses existing `personnel` roster, datacard, and metadata work as source material without leaning into protected GW naming or presentation more than necessary.

`Hololith` is the working name because it suggests a grim military tactical display surface without being too explicitly GW-coded.

## Naming

Working title:

- `Hololith`

Reasoning:

- lore-adjacent tone without needing a direct GW reference
- sounds like a system or tactical display, which fits the intended UI
- safer than terms that lean on obvious GW-specific vocabulary

Avoid:

- faux-Latin or Imperial terms
- explicit GW-coded nouns like `Strategium`, `Noosphere`, `Adeptus`, `Astartes`, `Mechanicus`, etc.

## Feasibility Assessment

Current conclusion:

- feasible as a unit-centric top-down tactical simulator
- not feasible as-is for a fully rules-faithful 40k simulator

The existing `personnel` codebase is a strong source layer for:

- roster loading
- resolved unit loadouts
- statlines
- weapon profiles
- wargear descriptions
- abilities text
- faction/shared metadata imported from BattleScribe catalogues

The current `play` data shape is useful for rendering and for partial combat resolution, but it is still mostly display-oriented rather than simulation-oriented.

## Important Constraint

We are choosing:

- player interaction at the **unit level**
- authoritative simulation geometry at the **model level**

That means the player should mostly move a unit as one object, but the engine must still maintain individual model/base positions internally in order to support:

- line of sight
- cover
- terrain collision
- engagement range
- unit coherency
- unit footprint realism

## Core Design Decision

Unit-level only, with no internal model positions, is too abstract for the battlefield features we want.

Pure model-by-model direct manipulation is too heavy for normal play.

So the intended compromise is:

1. The player drags a unit path or destination.
2. The engine computes the destination anchor.
3. The engine resolves individual model/base placement automatically.
4. The player only manually adjusts formation when automatic placement is ambiguous or unsatisfactory.

This is the right starting point.

## Movement / Formation Model

Planned interaction:

- user drags a line from a unit to an intended destination
- move is expressed as unit intent, not per-model movement
- post-move resolver arranges the models/bases into a legal formation

Planned responsibilities for the resolver:

- preserve unit coherency
- avoid collisions with terrain and other units
- respect impassable geometry
- produce a deterministic final arrangement
- reject or clamp illegal moves when no legal arrangement exists

Recommended implementation order:

### Tier 1

- unit drag only
- deterministic auto-placement of model bases
- simple formation presets
- accept/cancel if the result is legal but visually awkward

### Tier 2

- manual formation-adjust mode
- player can nudge models in exceptional situations
- live validation for coherency and collision

## Complexity Assessment

This is not too complex, but it does materially increase scope.

The project is still very feasible if we avoid a fully general search-heavy placement solver early on.

Recommended approach:

- start with a deterministic formation placement algorithm
- avoid physics simulation
- avoid a deep search-based legal-placement solver in v0.1

Things that will be hard later:

- narrow corridors
- complex ruins interiors
- pile-in / consolidation edge cases
- mixed base sizes
- attached leaders
- transports / disembarkation
- reserves / deep strike / redeploy edge cases

These should be explicitly deferred unless they are required for the first playable slice.

## Relationship To `personnel`

Current position:

- `personnel` should remain the authoring / source / roster system
- `Hololith` should consume exported or transformed data from `personnel`
- `Hololith` should not try to execute simulation rules directly from free-text metadata

That means `personnel` is the content layer, not the battle engine.

## What `personnel` Already Gives Us

Useful source data already present:

- canonical per-unit resolved loadouts
- selected weapons and wargear
- point totals
- tags
- unit statlines
- weapon profiles
- keyword lists
- ability descriptions
- shared faction metadata

This is enough to build a first-pass tactical engine around curated mechanics.

## What Is Missing

The current metadata structure is not yet rich enough to drive a battlefield simulator directly.

Major missing data / semantics:

- machine-readable rules effects
- explicit terrain interaction semantics
- base sizes / base geometry
- authoritative model composition details
- stable simulation IDs and versioned template contracts
- executable phase/trigger/action semantics

Free-text ability descriptions are useful UI, but not acceptable as engine logic.

## Recommended Sim Architecture

Introduce a dedicated Hololith simulation schema, separate from the current datacard/UI payload.

Suggested shapes:

- `UnitTemplate`
- `UnitState`
- `ModelState`
- `WeaponProfile`
- `AbilityEffect`
- `BattleState`
- `TerrainPiece`
- `ObjectiveState`

High-level meaning:

- `UnitTemplate`: static definition generated from army data + metadata
- `UnitState`: runtime unit status, wounds, flags, position anchor, etc.
- `ModelState`: per-model base position for geometry and visibility checks
- `AbilityEffect`: typed engine-readable behavior, not prose
- `BattleState`: turn, phase, board objects, score, action queue

## Recommended Scope For First Playable Slice

Keep the initial system narrow.

Include:

- movement
- LOS and range checks
- cover / blocking terrain
- shooting
- charge + melee
- objective control
- a curated subset of keywords and abilities

Defer:

- transports
- reserves
- mission pack complexity
- advanced aura stacking
- unusual terrain edge cases
- exhaustive special rules support

## Immediate Next Step

The next concrete step should be to define a sim-ready `UnitTemplate` contract and write a transformer from `personnel` canonical units + metadata into that contract.

That work will expose:

- which existing metadata is already good enough
- which fields are too loose or display-oriented
- where Hololith needs its own authored semantics

## Working Principles

- Keep interaction ergonomic at the unit level.
- Keep rules geometry authoritative at the model level.
- Prefer deterministic resolution over opaque solver magic.
- Crash rather than silently corrupting battlefield state.
- Keep prose metadata for UI; keep typed effects for the engine.
- Build a playable narrow slice before chasing full-system completeness.
