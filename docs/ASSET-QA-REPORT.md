# Asset QA Report

**Date:** 2026-10-02  
**Scope:** Generated Bauhinia, foreground and atmosphere assets.  
**Status:** Staged for later milestones; nothing in this report is currently
loaded by the website.

## Outcome

All 15 optimized WebP candidates open successfully and report an alpha-bearing
pixel format. The PNG originals remain untouched as source masters. Optimized
copies are stored in `docs/references/production-candidates/`; they have not
been moved into `public/`.

The browser contact sheet is `docs/ASSET-CONTACT-SHEET.html`. It displays every
candidate against both dark and light backgrounds so edge contamination and
unwanted rectangular backdrops can be spotted visually.

## Approved inventory

| Production candidate | Dimensions | Size | Decision | Intended use |
|---|---:|---:|---|---|
| `bauhinia-petal.webp` | 512 × 500 | 29 KB | Direct-use candidate | Replace the code-drawn petal texture |
| `harbour-spray.webp` | 1600 × 534 | 178 KB | Direct-use candidate | Ferry waterline effect in 03; optional subtle use in 04 |
| `coral-clouds.webp` | 1600 × 534 | 251 KB | Direct-use candidate | Distant sky in 01 and 06 |
| `harbour-mist.webp` | 1600 × 534 | 220 KB | Direct-use candidate | Depth separation in 01–05 |
| `firework-burst.webp` | 768 × 692 | 253 KB | Direct-use candidate | Replace the 06 burst markers |
| `firework-smoke.webp` | 1600 × 800 | 382 KB | Direct-use candidate | Smoke behind the 06 bursts |
| `firework-embers.webp` | 1024 × 682 | 87 KB | Direct-use candidate | Sparse falling embers in 06 |
| `bauhinia-flower-cluster.webp` | 892 × 1024 | 208 KB | Conditional | Optional near accent in Hero / 01 |
| `bauhinia-tree.webp` | 1280 × 1088 | 409 KB | Conditional | A/B-test only; procedural tree remains approved |
| `bauhinia-trunk-branches.webp` | 1280 × 1088 | 361 KB | Conditional | Layered-tree experiment only |
| `wet-paving.webp` | 1600 × 532 | 125 KB | Conditional | Must be adapted into a material before use |
| `ferry-bow-fragment.webp` | 1280 × 1024 | 239 KB | Conditional | Hold unless the code ferry has a documented close-up problem |
| `promenade-railing.webp` | 1600 × 678 | 117 KB | Reference / fallback | Existing world-space railing remains approved |
| `promenade-lamp.webp` | 854 × 1280 | 63 KB | Reference / fallback | Existing world-space lamps remain approved |
| `water-reflections.webp` | 1600 × 800 | 396 KB | Reference / fallback | Existing dynamic reflection system remains approved |

## Technical checks

- All production candidates report a `yuva` WebP pixel format, confirming that
  an alpha channel is present.
- No zero-byte or unreadable candidate files remain.
- The petal, embers, spray, mist, clouds, railing, lamp and paving candidates
  are within or close to their staging budgets.
- The firework burst is approximately at its 250 KB target.
- Firework smoke is intentionally retained at 1600 px for the first visual
  test. Resize it further only if it occupies a small portion of the viewport.
- Tree, trunk and water-reflection files exceed launch targets but are not
  approved direct-use assets, so further compression would provide no current
  benefit.

## Visual review checklist

When reviewing the contact sheet, check for:

1. Bright or coloured halos that appear only on the light background.
2. Hard rectangular edges on clouds, mist, smoke or fireworks.
3. Fine branches, spray droplets or firework trails disappearing on dark sky.
4. Assets whose lighting direction conflicts with the harbour storyboard.
5. Artificial detail that becomes distracting at the intended on-screen size.

Visual approval of a contact-sheet thumbnail does not approve placement in the
scene. Placement remains governed by `ASSET-INTEGRATION-BLUEPRINT.md`.

## Handoff rule for Cursor

During the foreground / atmosphere milestone, copy only the specific approved
candidate being tested into `public/`. Do not bulk-copy this directory. Integrate
in the order defined by `ASSET-INTEGRATION-BLUEPRINT.md`, and keep reference and
conditional assets out of the runtime bundle unless a later review approves
them.
