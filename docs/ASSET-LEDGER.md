# Asset Ledger

Nothing enters production without a recorded source and usage right. `Original`
means created specifically for this project; reference images are not themselves
approved production assets.

## Phase A — grey-box validation

These are generated in code from primitive geometry and simple materials. They
are prototypes, not files to source or polish.

Chapters are numbered `01–06` to match the storyboard frames. Full geometry
specifications are in `CURSOR-GREYBOX-BRIEF.md` section 6.

| Working asset | Representation | Chapters | Purpose | Exit test |
|---|---|---:|---|---|
| Water | Plane with a standard material and a runtime canvas normal map (no custom shader) | 01–05 | Establish horizon, motion, and reflections | Reads as water without post-processing |
| Kowloon edge | Boxes and a flat promenade strip | 01–03 | Anchor origin of journey | Direction of departure is clear |
| Clock Tower proxy | Stacked boxes | 01–02 | Test silhouette and copy clearance | Recognisable by proportion and placement |
| Star Ferry proxy | Box hull and deck blocks | 01–04 (hidden on mobile 01–02) | Test crossing path and scale | Path never clips camera or foreground |
| Junk proxy | Hull block and three fan sails | 01, 04 | Test the hero composition | Red sail remains fully readable on mobile |
| IFC proxy | Tall tapered/stepped tower block | 01, 03–06 | Test island approach and vertical framing | Crown remains visible at target aspect ratios |
| Observation Wheel proxy | Torus ring, spokes, hub, A-frame supports | 01, 03, 05 | Test the Central waterfront group and the chapter 05 co-star scale | Small readable circle in 01; about 46% of frame height on desktop 05 |
| Skyline and mountain proxy | Instanced boxes plus silhouette plane | All | Test depth layers and fog | Major layers separate in grayscale |
| Foreground cards | Railing geometry and flat palm silhouettes | 01–02 | Test occlusion and chapter handoff | No card blocks copy or causes a visible pop |
| Firework burst markers | 4 static flat discs, no particles | 06 | Hold the firework composition until the real effect exists | Bursts sit upper-right and leave the copy region clear |

## Phase B — launch-critical production assets

| Filename | Type | Chapter | Priority | Target size | Rights/source | Notes |
|---|---|---:|---|---:|---|---|
| `clock-tower.glb` | 3D | 01–02 | P0 | <700 KB | Original model from owned/licensed references | Silhouette, clock face, warm openings; no tiny masonry |
| `star-ferry.glb` | 3D animated | 01–04 | P0 | <1 MB | Original model from owned/licensed references | Hull, two decks, canopy; wake remains procedural |
| `junk-boat.glb` | 3D animated | 01, 04 | P0 | <1.5 MB | Original model from owned/licensed references | Hero asset; hull and red sails, minimal rig only if needed |
| `ifc.glb` | 3D | 01, 03–06 | P0 | <500 KB | Original model from owned/licensed references | Recognisable crown and proportions; windows procedural/material-based |
| `observation-wheel.glb` | 3D | 01, 03, 05 | P0 | <500 KB | Original model from owned/licensed references | Ring, spokes, gondolas, supports; co-star scale in 05; lighting material-based |
| Fireworks | Effect (technique TBD) | 06 | P1 | TBD | Original | Decide after the grey-box: particles, illustrated plate, or alpha cards; 4–5 separated bursts per Frame 06 |
| `skyline.glb` | 3D environment | All | P0 | <1.5 MB | Original modular blocks | Curated silhouette, not a full city twin |
| `mountain-silhouette.webp` | Alpha WebP | All | P0 | <180 KB | Original | Can remain a depth card if it survives parallax tests |
| `harbour-poster-desktop.webp` | Fallback/poster | All | P0 | <350 KB | Original | 16:10-safe master, no embedded text |
| `harbour-poster-mobile.webp` | Fallback/poster | All | P0 | <250 KB | Original | Authored portrait composition, no embedded text |
| `promenade-railing.webp` | Alpha WebP | 01–02 | P1 | <250 KB | Original | Transparent edge-tested cutout |
| `palm-branch.webp` | Alpha WebP | 02 | P2 | <200 KB | Original | Remove if it reads as generic tropical decoration |
| `pier-foreground.webp` | Alpha WebP | 03 | P2 | <250 KB | Original | Not in approved Frame 03; add only if the grey-box shows the chapter needs near depth |
| `rope-foreground.webp` | Alpha WebP | 04 | P2 | <180 KB | Original | Optional; approved Frame 04 has no foreground layer, so add only if it improves depth without clutter |

## Phase C — optional editorial and polish assets

| Filename | Type | Chapter | Priority | Target size | Rights/source | Decision rule |
|---|---|---:|---|---:|---|---|
| `junk-detail.webp` | Editorial plate | 04 | P2 | <250 KB | Original | Use only if live 3D cannot deliver the intended illustrated close-up |
| `ifc-detail.webp` | Editorial plate | 05 | P2 | <250 KB | Original | Use only if the skyline needs additional illustrated depth |
| `water-noise.webp` | Tileable texture | All | P1 | <120 KB | Original or clearly licensed | Prefer procedural generation if it is cheaper and visually stable |
| `halftone.webp` | Overlay texture | All | P2 | <100 KB | Original | Must remain restrained and avoid reducing text contrast |
| Local font files and licences | WOFF2 + text | All | P0 | TBD after font choice | Licensed for web embedding | Choose during typography study; never ship unverified font files |

## Phase D — layer candidates (not approved)

Ideas for more depth layers, after Kage's technique of stacking foreground,
midground, background and atmosphere. Each one still has to pass gate 5 below
(replace a placeholder or solve a documented visual problem) before it is made.

| Working name | Type | Chapter | Layer | Purpose |
|---|---|---:|---|---|
| Railing over the wordmark's feet | Use of `promenade-railing.webp` | Hero | Foreground | Kage's main depth trick: scenery passing in front of the title. Needs the user to reverse the "nothing covers 香港" decision |
| `promenade-lamp.webp` | Alpha WebP | Hero, 01–02 | Foreground | Tsim Sha Tsui promenade lamp at the frame edge; a strong near silhouette |
| Moon | **Built 2026-10-01** as an original procedural disc and halo (`createMoon.js`), no file | All (world object) | Background | Yellow focal light behind the Peak ridge; a painted `moon.webp` may replace the disc later |
| `mist-band.webp` | Alpha WebP, tiled | All | Between skyline layers | Drifting haze that separates near and far buildings |
| Black kites | Small animated sprites | Hero, 01–03 | Sky | Hong Kong's signature bird gliding slowly; a living detail |
| Sampans and distant ferries | Low-poly or cards | 01, 03–04 | Midground | Busy-harbour feel; lit windows and wakes at a distance |
| Skyline reflections | Procedural streaks on the water | 01, 05 | Water | Vertical light smears under lit buildings |
| Neon sign cutouts | Alpha WebP set | 05 | Foreground edges | Hanging Chinese neon signs framing the City of Light |
| Searchlight beams | Procedural | 05–06 | Sky | A nod to the Symphony of Lights show |
| Smoke wisps | Alpha WebP | 06 | Sky | Drift after the fireworks, for the afterglow |
| Promenade crowd silhouettes | Alpha WebP | 06 | Foreground | People watching the fireworks; scale and warmth |

## Asset approval gates

1. Grey-box camera approval comes before final modelling.
2. Every production asset gets a source URL/file, creator, licence, and date in
   this ledger before import.
3. Test each GLB alone in the browser before integrating it into the world.
4. Test alpha cutouts against both light and dark backgrounds at desktop and
   mobile scale.
5. A new asset must replace a named placeholder or solve a documented visual
   problem; otherwise it waits until polish.

**Status:** Phase A approved for the grey-box milestone (2026-10-01). Phase B
and C budgets are recommendations; sources and final asset choices remain open.
