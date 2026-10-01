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
| Star Ferry proxy | Rounded two-deck ferry built in code: green hull and lower deck, white upper deck, framed lit windows, fender, canopy, funnel, wheelhouses, foam line (reshaped, user request, 2026-10-01; was box blocks) | 01–04 (hidden on mobile 01–02) | Test crossing path and scale | Path never clips camera or foreground |
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
| `star-ferry.glb` | 3D animated | 01–04 | P0 | <1 MB | Made by the user in Meshy.ai (user decision, 2026-10-01); rights depend on the Meshy plan, see "Meshy models" below | Hull, two decks, canopy; wake remains procedural. Replaces the code-built ferry (reshaped 2026-10-01), which stays until then |
| `junk-boat.glb` | 3D animated | 01, 04 | P0 | <1.5 MB | Original model from owned/licensed references | Hero asset; hull and red sails, minimal rig only if needed |
| `ifc.glb` | 3D | 01, 03–06 | P0 | <500 KB | Original model from owned/licensed references | Recognisable crown and proportions; windows procedural/material-based |
| `observation-wheel.glb` | 3D | 01, 03, 05 | P0 | <500 KB | Original model from owned/licensed references | Ring, spokes, gondolas, supports; co-star scale in 05; lighting material-based |
| Fireworks | Effect (technique TBD) | 06 | P1 | TBD | Original | Decide after the grey-box: particles, illustrated plate, or alpha cards; 4–5 separated bursts per Frame 06 |
| `skyline.glb` | 3D environment | All | P0 | <1.5 MB | Original modular blocks | Curated silhouette, not a full city twin |
| `mountain-silhouette.webp` | Alpha WebP | All | P0 | <180 KB | Original | Can remain a depth card if it survives parallax tests |
| `harbour-poster-desktop.webp` | Fallback/poster | All | P0 | <350 KB | Original | 16:10-safe master, no embedded text |
| `harbour-poster-mobile.webp` | Fallback/poster | All | P0 | <250 KB | Original | Authored portrait composition, no embedded text |
| `promenade-railing.webp` | Alpha WebP | 01–02 | P1 | <250 KB | Original | Transparent edge-tested cutout |
| `bauhinia-petals.webp` | Alpha WebP sprite sheet | All but 06 | P1 | <120 KB | Original, made by the user | 4–6 single petals, a few edge-on; replaces the code-drawn petal in `createPetals.js`. References below |
| `bauhinia-tree.webp` | Alpha WebP | Hero, 01–02 | P2 | <300 KB | Original, made by the user | Blossoming branch or tree cutout at the frame edge, where the petals come from; a foreground layer in Kage's manner |
| `palm-branch.webp` | Alpha WebP | 02 | P2 | <200 KB | Original | Remove if it reads as generic tropical decoration |
| `pier-foreground.webp` | Alpha WebP | 03 | P2 | <250 KB | Original | Not in approved Frame 03; add only if the grey-box shows the chapter needs near depth |
| `rope-foreground.webp` | Alpha WebP | 04 | P2 | <180 KB | Original | Optional; approved Frame 04 has no foreground layer, so add only if it improves depth without clutter |

### Meshy models

The user builds `star-ferry.glb` in Meshy.ai (user decision, 2026-10-01).
Checked against Meshy's terms on 2026-10-01:

- **Paid plan:** the user owns the model; no credit needed. The model must not
  be published to the Meshy Community.
- **Free plan:** licensed CC BY 4.0. Commercial use is allowed, but the site
  must credit "Model created with Meshy – CC BY 4.0 License" (in the footer
  or a credits page). Meshy 6 and 7 downloads need a paid plan.
- Rights follow the plan active when the model was generated.
- Any image uploaded to Meshy (image-to-3D) must be the user's own photo or
  one with clear rights. Text-to-3D avoids this question.

Record before import: plan, generation date, Meshy model version, the prompt
or input image, and the export settings.

Fit to the scene (the code-built ferry's numbers, so camera framings still hold):

- Bow along +X, waterline at the origin, upright (+Y).
- About 40 m long, 10 m wide, roof about 8 m above the water (wheelhouses and
  funnel to about 10 m); scale can be
  corrected in code, but the proportions (about 4 : 1 : 1) should match.
- Double-ended, as the real boats are: both ends alike.
- Low poly: about 10–20k triangles (Meshy's remesh / target polycount), one
  1024 px texture set. Compressed after export to stay under 1 MB.
- Lit windows are added in code as a glowing material, so the texture can
  show them unlit.
- Test it alone in the browser first (gate 3 below).

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
| Bauhinia petals | **Built 2026-10-01** as an original petal drawn in code (`createPetals.js`), no file | All but 06 | Near and far | The site's constant particle effect, in place of Kage-style leaves or rain |
| Surface textures | **Built 2026-10-01** (user request), original, drawn in code (`surfaces.js`), no files: Clock Tower brick, granite bands, quoins and arched windows (colour, bump, glow); granite ashlar; clock dial; ferry deck walls with framed windows (green and white, colour and glow), ferry hull and waterline foam (added with the ferry reshape, user request, 2026-10-01); junk sail cloth and hull planks | 01–05 | Midground | Textured surfaces instead of flat colour; the GLB models may replace them later |
| Lit windows | **Built 2026-10-01** (user request), original, generated in the shader (`cityWindows.js`), no file | All | Background | Window grids on the skyline and IFC; fades to an average glow when windows get too small to show |
| `mist-band.webp` | Alpha WebP, tiled | All | Between skyline layers | Drifting haze that separates near and far buildings |
| Black kites | Small animated sprites | Hero, 01–03 | Sky | Hong Kong's signature bird gliding slowly; a living detail |
| Sampans and distant ferries | Low-poly or cards | 01, 03–04 | Midground | Busy-harbour feel; lit windows and wakes at a distance |
| Skyline reflections | Procedural streaks on the water | 01, 05 | Water | Vertical light smears under lit buildings |
| Neon sign cutouts | Alpha WebP set | 05 | Foreground edges | Hanging Chinese neon signs framing the City of Light |
| Searchlight beams | Procedural | 01, 05–06 | Sky | A nod to the Symphony of Lights show; the frame 01 storyboard shows beams rising from the Central towers (user reminder below) |
| Smoke wisps | Alpha WebP | 06 | Sky | Drift after the fireworks, for the afterglow |
| Promenade crowd silhouettes | Alpha WebP | 06 | Foreground | People watching the fireworks; scale and warmth |

## User reminders (2026-10-01)

Things the user plans to add, so the harbour looks closer to the frame 01
storyboard (`docs/storyboards/frame-01-harbour-at-dusk-rough.jpg`). Assets
the user makes are original; anything made with an AI tool records the tool,
plan and prompt here before import (as for Meshy above).

| Reminder | Look in the storyboard | Becomes | Made by | When |
|---|---|---|---|---|
| Stone railing | Dark stone balustrade along the promenade, square posts topped with warm lanterns | `promenade-railing.webp` (Phase B, P1), or a low-poly model if it must turn corners in 3D; the lantern glow is added in code | User | Milestone 3 (assets) |
| Trees | Rows of palms along the Tsim Sha Tsui promenade, framing the Clock Tower | Palm cutouts replacing the flat palm cards (`palm-branch.webp` widened to a set), plus the bauhinia tree already listed | User | Milestone 3 |
| Wet tiles | Promenade paving shining with reflected lamp light | A tileable wet-paving texture on the promenade deck, with glossy reflections | User | Milestone 3; the shine is tuned in Milestone 4 |
| Clouds | Heavy clouds lit coral from below by the city | A cloud layer in the sky (painted cards or a procedural layer), kept clear of the moon | User artwork or code | Milestone 4 (atmosphere) |
| Light beams | Searchlights rising from the Central towers | "Searchlight beams" in Phase D, now including 01 | Code | Milestone 4 |
| More realistic buildings | Recognisable towers (Bank of China, Central Plaza) with lit window grids | `skyline.glb` (Phase B, P0), with a few landmark towers modelled more closely | User (Meshy or similar) | Milestone 3 |
| More light at ground level in Central | A bright band of street and podium lights along the Central waterfront, with long reflections | A waterfront light strip plus the "Skyline reflections" layer in Phase D | Code | Milestone 2 look test (lit windows) or Milestone 4 |

## Reference material (not for production)

Kept to guide original artwork. Sources and rights are unknown, so these files
are never shipped, traced or used as textures.

| File | Shows | Notes for the artwork |
|---|---|---|
| `docs/references/bauhinia/bauhinia-tree.png` | A Hong Kong orchid tree (Bauhinia blakeana) in full bloom | Dense pink-purple canopy over green leaves; the blossom reads as a soft mass, not single flowers |
| `docs/references/bauhinia/bauhinia-flowers-rain.jpg` | Flowers with raindrops | Deep fuchsia-magenta; petals curl and twist; long pale curved stamens |
| `docs/references/bauhinia/bauhinia-flower-closeup.jpg` | One open flower | Five narrow petals with wavy edges and pale veins radiating from the base; the top petal is darker with a crimson centre |

Added 2026-10-01 by the user as a reminder for the petal and tree assets.

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
