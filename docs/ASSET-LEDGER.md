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
| Water | Plane with a standard material and a runtime canvas normal map; since 2026-10-02 a shader patch draws the light reflections ("Skyline reflections", Phase D; user choice) | 01–05 | Establish horizon, motion, and reflections | Reads as water without post-processing |
| Kowloon edge | Boxes and a flat promenade strip | 01–03 | Anchor origin of journey | Direction of departure is clear |
| Clock Tower proxy | Stacked boxes | 01–02 | Test silhouette and copy clearance | Recognisable by proportion and placement |
| Star Ferry proxy | Rebuilt in code from the user's reference photos (user request, 2026-10-01; first reshaped from box blocks the same day): lofted double-ended green hull with sheer, flare and waterline band, wooden rubbing strip, tyre fenders; open lower deck with green posts, bulwark and a lit cabin behind; green band, white upper deck with framed lit windows and dark bridge glass at both ends, 48 white life rings; roof with liferaft canisters, funnel, tripod masts and rigging; navigation lights; foam line. No names or emblems | 01–04 (hidden on mobile 01–02) | Test crossing path and scale | Path never clips camera or foreground |
| Junk proxy | Rebuilt in code (user request, 2026-10-01; was a hull block and three fan sails): lofted varnished hull, lit stern deckhouse, canopy, rails, tyre fenders, three big battened red sails uplit from the deck (enlarged after the user's photo, user request, 2026-10-01), rigging (masthead pennants removed, user request, 2026-10-01) | 01, 04 | Test the hero composition | Red sail remains fully readable on mobile |
| IFC proxy | Tall tapered/stepped tower block | 01, 03–06 | Test island approach and vertical framing | Crown remains visible at target aspect ratios |
| Observation Wheel proxy | Torus ring, spokes, hub, A-frame supports | 01, 03, 05 | Test the Central waterfront group and the chapter 05 co-star scale | Small readable circle in 01; about 46% of frame height on desktop 05 |
| Skyline and mountain proxy | Instanced boxes plus silhouette plane. Mountains rebuilt in code 2026-10-02 (user choices, `createMountains.js`): three ranges with jagged ridges and the Peak's outline, shaded from a dark foot to a lighter ridge, a moonlit edge near the moon, a mist band at the foot and dim slope lights; each range's ends slope down to the water like headlands (user request, 2026-10-02); no files | All | Test depth layers and fog | Major layers separate in grayscale |
| Foreground cards | Railing geometry and flat palm silhouettes (both since rebuilt in 3D, 2026-10-02) | 01–02 | Test occlusion and chapter handoff | No card blocks copy or causes a visible pop |
| Firework burst markers | 4 static flat discs, no particles | 06 | Hold the firework composition until the real effect exists | Bursts sit upper-right and leave the copy region clear |

## Phase B — launch-critical production assets

**No GLB files (user decision, 2026-10-01):** "If Kage didn't use any GLB
files, I will follow that." Kage's public repository has no 3D model files
(only images, fonts and three.js) and builds its shapes in code. So the 3D
rows below are built in code, original, with no files; photos and Meshy
models are references only.

| Filename | Type | Chapter | Priority | Target size | Rights/source | Notes |
|---|---|---:|---|---:|---|---|
| Clock Tower | 3D, built in code (`createKowloonEdge.js`) | 01–02 | P0 | — | Original code | Silhouette, clock face, warm openings; textured since 2b. Rebuilt from reference photos 2026-10-01 (user request): real proportions (9 m shaft, cornice 32 m, dome 44 m, mast 51 m), granite pilasters, bracketed cornice, two crown stages with scrolls, columns and balconies, dome and lattice mast, three Roman-numeral dials, lit arched door, golden floodlit glow. No signage or logos |
| Star Ferry | 3D animated, built in code (`createVessels.js`) | 01–04 | P0 | — | Original code | Reshaped, then rebuilt from reference photos 2026-10-01 (user request): lofted hull, open lower deck, life rings, roof gear, masts, navigation lights |
| Junk | 3D animated, built in code (`createVessels.js`) | 01, 04 | P0 | — | Original code, from the user's photo and reference-only photos and Meshy renders | Rebuilt 2026-10-01 (user request); hero asset |
| IFC | 3D, built in code (`createIsland.js`) | 01, 03–06 | P0 | — | Original code | Recognisable crown and proportions; lit windows in the shader. Rebuilt from reference photos 2026-10-02 (user request): recessed-corner tiers with pale corner piers, shallow setbacks to a rounded top, face slots, bronze refuge bands, floodlit top tiers, cool white crown fins; lit IFC Mall podium |
| Observation Wheel | 3D, built in code (`createIsland.js`) | 01, 03, 05 | P0 | — | Original code | Ring, spokes, gondolas, supports; co-star scale in 05. Rebuilt from reference photos 2026-10-02 (user request): true 60 m scale, red-pink lit truss rim, cable spokes, glowing hub, 42 upright violet gondolas, white A-frame legs, boarding tents; turns slowly (still in reduced motion). No sponsor banners or lettering |
| Central Ferry Piers | 3D, built in code (`createIsland.js`) | 01, 03, 05 | P1 | — | Original code | Added 2026-10-02 (user request): five lit pavilions with colonnades and pitched green roofs along the Central waterfront under IFC |
| Fireworks | Effect (technique TBD) | 06 | P1 | TBD | Original | Decide after the grey-box: particles, illustrated plate, or alpha cards; 4–5 separated bursts per Frame 06 |
| Skyline | 3D environment, built in code | All | P0 | — | Original code, modular blocks | Curated silhouette, not a full city twin. Varied tops added 2026-10-02 (user choice, `createIsland.js`): narrower upper sections, dim lit roof bands, pyramid roofs, dark masts with red warning lights |
| Central landmarks | 3D, built in code (`landmarks.js`) | 01, 03–06 | P1 | — | Original code; brace, colour-bar and neon-line patterns drawn on canvases in code, no files | Added 2026-10-02 (user choice), from general knowledge of the buildings' forms, no logos or signage: Bank of China Tower (four stepped triangular shafts, white X braces, twin masts), Cheung Kong Center (evenly lit square box, crown band), Central Plaza (chamfered triangle, colour bars, pyramid, mast), The Center (chamfered shaft, crown steps, spire, colour-changing neon lines). Lit below IFC |
| `mountain-silhouette.webp` | Alpha WebP | All | P0 | <180 KB | Original | Can remain a depth card if it survives parallax tests |
| `harbour-poster-desktop.webp` | Fallback/poster | All | P0 | <350 KB | Original | 16:10-safe master, no embedded text |
| `harbour-poster-mobile.webp` | Fallback/poster | All | P0 | <250 KB | Original | Authored portrait composition, no embedded text |
| `promenade-railing.webp` | Alpha WebP | 01–02 | P1 | <250 KB | Original | Transparent edge-tested cutout. **Replaced 2026-10-02** (user decision): the stone railing is built in code (next row) |
| Stone railing and lanterns | 3D, built in code (`createForeground.js`, `lamps.js`) | Hero, 01–02 | P1 | — | Original code, from the user's AI-made railing design (reference only, below) | Built 2026-10-02 (user request): granite plinth and pedestals, square posts with carved wave panels, slim mid posts, round rails, a cast-iron lantern with glow on every second post; warm light pools faked in the materials. Extended the same day to every water edge near the Clock Tower (user request) |
| Wet promenade paving | Shader, built in code (`addWetPaving` in `lamps.js`, `promenadePaving` in `surfaces.js`) | Hero, 01–06 | P1 | — | Original code, from the user's AI-made wet-paving design (reference only, below) | Built 2026-10-02 (user request): square granite slabs with dark joints on the promenade and promontory, wet patches, and narrow warm reflections of every lantern, lamp and the tower floodlight. Same day, middle-ground look (user choice): reflections broken into flecks, faint glow, dusk-sky sheen, per-slab tone and gloss, lit joint bevels |
| Shell icons | Inline SVG in `index.html` | All | P1 | <1 KB | Original | The red-sail logo (header, and beside the footer statement since 2026-10-02) and the thin ↑ arrow on the "Return to the harbour" button at the top of the footer (2026-10-02, user request). Drawn for this site; Kage's ↗ button arrow and lettering are not copied |
| Promenade lamps | 3D, built in code (`createForeground.js`) | 02 | P1 | — | Original code, from the user's AI-made lamp design (reference only, below) | Built 2026-10-02 (user request): three 4.2 m cast-iron lamps on the Clock Tower promontory, clear of the tower and ferry |
| Promenade palms | 3D, built in code (`palms.js`, atlas `palmAtlas` in `surfaces.js`) | 02 | P1 | — | Original code; leaflets and bark drawn in code, no image or reference traced | Built 2026-10-02 (user request), replacing the flat palm cards: two shapes (a tall coconut palm with a curved trunk, a straighter palm with a round crown over dead fronds), nine palms including a row of five behind the Clock Tower, plus three desktop-only (a grove left of the tower and a pair between the tower and the ferry; user choice, same day), slow sway (still in reduced motion), warm lamp light. Supersedes `palm-branch.webp` |
| `bauhinia-petals.webp` | Alpha WebP sprite sheet | All but 06 | P1 | <120 KB | Original, made by the user | 4–6 single petals, a few edge-on; replaces the code-drawn petal in `createPetals.js`. References below |
| Bauhinia tree | 3D, built in code (`bauhinia.js`, atlas `bauhiniaAtlas` in `surfaces.js`) | Hero (desktop) | P1 | — | Original code; leaves, flowers and bark drawn in code. The user's AI images (`docs/references/bauhinia/generated/`, not committed) and the reference photos guided the shape and colours only; nothing traced or shipped | Built 2026-10-02 (user choice): a leaning trunk with arching limbs and about 2,700 leaf, flower and bud cards framing the hero's right edge, gentle flutter, 18 petals falling from its flowers (still in reduced motion). Desktop only. Supersedes `bauhinia-tree.webp` |
| `bauhinia-tree.webp` | Alpha WebP | Hero, 01–02 | P2 | <300 KB | Original, made by the user | Blossoming branch or tree cutout at the frame edge, where the petals come from; a foreground layer in Kage's manner. **Not needed since 2026-10-02**: the tree is built in code ("Bauhinia tree") |
| `palm-branch.webp` | Alpha WebP | 02 | P2 | <200 KB | Original | Remove if it reads as generic tropical decoration. **Not needed since 2026-10-02**: the palms are built in code ("Promenade palms") |
| `pier-foreground.webp` | Alpha WebP | 03 | P2 | <250 KB | Original | Not in approved Frame 03; add only if the grey-box shows the chapter needs near depth |
| `rope-foreground.webp` | Alpha WebP | 04 | P2 | <180 KB | Original | Optional; approved Frame 04 has no foreground layer, so add only if it improves depth without clutter |

### Meshy models

**Reference only (user decision, 2026-10-01).** Meshy models are looked at
(screenshots, measurements) to build the code models more realistically, and
are never shipped or stored in the site. The earlier plan for a Meshy
`star-ferry.glb` on the site is dropped with the "no GLB" decision above.
The terms and fit notes below are kept for the record. Checked against Meshy's
terms on 2026-10-01:

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
| `promenade-lamp.webp` | Alpha WebP | Hero, 01–02 | Foreground | Tsim Sha Tsui promenade lamp at the frame edge; a strong near silhouette. Superseded 2026-10-02 by the lamps built in code (Phase B) |
| Moon | **Built 2026-10-01** as an original procedural disc and halo (`createMoon.js`), no file | All (world object) | Background | Yellow focal light behind the Peak ridge; a painted `moon.webp` may replace the disc later |
| Bauhinia petals | **Built 2026-10-01** as an original petal drawn in code (`createPetals.js`), no file | All but 06 | Near and far | The site's constant particle effect, in place of Kage-style leaves or rain |
| Surface textures | **Built 2026-10-01** (user request), original, drawn in code (`surfaces.js`), no files: Clock Tower shaft brick with stone-framed sash windows and frieze, rusticated granite pilasters and brick crown stages with arched openings (colour and golden glow; redrawn with the tower rebuild, user request, 2026-10-01, replacing the brick, bands, quoins and arched windows with bump); granite ashlar; clock dial with Roman numerals and a minute track; ferry upper deck walls with paired framed windows (sides lit; ends with two dark bridge bays; colour and glow), lit lower cabin with seat backs and passengers, hull with pale line and waterline band, and waterline foam (redrawn with the ferry rebuild, user request, 2026-10-01; the reshape's green and white deck walls are no longer used by the ferry); junk sail cloth, varnished hull with waterline stripe and rail cap, and lit deckhouse walls (rebuilt with the junk, user request, 2026-10-01); the Observation Wheel's soft hub glow, 64 × 64 (user request, 2026-10-02); the stone railing's dark speckled granite (64 × 64, 1 m tile) and post panel with three carved waves (64 × 96) (user request, 2026-10-02); the promenade's granite slabs, 0.8 m square with dark joints (240 × 240, 2.4 m tile; user request, 2026-10-02); the palms' atlas, one frond with slanted leaflets and a bark strip with leaf-scar rings (256 × 256; user request, 2026-10-02); the bauhinia atlas, a two-lobed leaf, an open five-petal flower, buds and a leaf clump (512 × 512; user choice, 2026-10-02) | 01–05 | Midground | Textured surfaces instead of flat colour |
| Lit windows | **Built 2026-10-01** (user request), original, generated in the shader (`cityWindows.js`), no file | All | Background | Window grids on the skyline and IFC; when bays get too narrow each floor becomes a strip of lit and dark runs, and only then fades to an average glow (2026-10-02, user choice; IFC also warmer and brighter). Central buildings dimmed so IFC leads: 20% lit, at most 30% per building (2026-10-02, user request); close-up windows peak at 70% and the skyline dims to 60% in 05 (2026-10-02, user choice) |
| `mist-band.webp` | Alpha WebP, tiled | All | Between skyline layers | Drifting haze that separates near and far buildings. A band between the skyline and the near range is drawn in code since 2026-10-02 (`createMountains.js`); the file is only needed for haze between building rows |
| Black kites | Small animated sprites | Hero, 01–03 | Sky | Hong Kong's signature bird gliding slowly; a living detail |
| Sampans and distant ferries | Low-poly or cards | 01, 03–04 | Midground | Busy-harbour feel; lit windows and wakes at a distance |
| Skyline reflections | **Built 2026-10-02** (user choice), original, glints drawn in the water shader (`waterReflections.js`, `createWater.js`) plus a 256 × 1 skyline strip computed in code, no file | All with water in view | Water | Glittering reflections like the user's junk photo: small horizontal glints with dark gaps, ragged edges and soft ends under IFC, the Clock Tower, the ferry, the junk's sails and the moon, over a dim shimmer from the whole skyline. Reworked twice the same day (user requests): the first solid streaks read as thin vertical bars, the second as plain rectangles |
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
| Stone railing | Dark stone balustrade along the promenade, square posts topped with warm lanterns | **Built 2026-10-02** in code from the user's design, with lanterns and three tall lamps ("Stone railing and lanterns", Phase B) | User design, code | Done |
| Trees | Rows of palms along the Tsim Sha Tsui promenade, framing the Clock Tower | 3D palms built in code replacing the flat palm cards, plus the bauhinia tree already listed | Code (palms and bauhinia) | Palms **done 2026-10-02** ("Promenade palms", Phase B); bauhinia tree **done 2026-10-02** in code ("Bauhinia tree"), pulled forward from Milestone 3 |
| Wet tiles | Promenade paving shining with reflected lamp light | A tileable wet-paving texture on the promenade deck, with glossy reflections | User design, code | **Done 2026-10-02**: built in code from the user's design ("Wet promenade paving", Phase B) |
| Clouds | Heavy clouds lit coral from below by the city | A cloud layer in the sky (painted cards or a procedural layer), kept clear of the moon | User artwork or code | Milestone 4 (atmosphere) |
| Light beams | Searchlights rising from the Central towers | "Searchlight beams" in Phase D, now including 01 | Code | Milestone 4 |
| More realistic buildings | Recognisable towers (Bank of China, Central Plaza) with lit window grids The code-built skyline (Phase B, P0), with a few landmark towers modelled more closely in code (no GLB, user decision 2026-10-01) | Code, from the user's references (photos, Meshy models) | Milestone 3 |
| More light at ground level in Central | A bright band of street and podium lights along the Central waterfront, with long reflections | A waterfront light strip plus the "Skyline reflections" layer in Phase D | Code | Reflections **done 2026-10-02** ("Skyline reflections", Phase D); the waterfront light strip in Milestone 4 |

## Reference material (not for production)

Kept to guide original artwork and models. Unless a row says the user took the
photo, sources and rights are unknown. None of these files is ever shipped,
traced or used as a texture. Files of unknown rights stay on the user's
computer only: since the repo went public (2026-10-02, user choice) the three
bauhinia photos are git-ignored and were removed from the whole history.

| File | Shows | Notes for the artwork |
|---|---|---|
| `docs/references/bauhinia/bauhinia-tree.png` | A Hong Kong orchid tree (Bauhinia blakeana) in full bloom | Dense pink-purple canopy over green leaves; the blossom reads as a soft mass, not single flowers |
| `docs/references/bauhinia/bauhinia-flowers-rain.jpg` | Flowers with raindrops | Deep fuchsia-magenta; petals curl and twist; long pale curved stamens |
| `docs/references/bauhinia/bauhinia-flower-closeup.jpg` | One open flower | Five narrow petals with wavy edges and pale veins radiating from the base; the top petal is darker with a crimson centre |

Added 2026-10-01 by the user as a reminder for the petal and tree assets.

| `docs/references/junk/junks-at-night-promenade.jpg` | Two red-sailed junks at night off Central, seen from the Tsim Sha Tsui promenade | Taken by the user (their own photo, 2026-10-01). Uplit sails glow vivid red over dark hulls; long broken red reflections on the water; warm deck lights. Reference for the junk rebuild |

The junk rebuild also uses the user's Meshy renders of a junk and web photos
of harbour junks, looked at only and not stored (user decision, 2026-10-01:
Meshy models serve as reference, not as shipped assets).

The Star Ferry rebuild (user request, 2026-10-01) uses six web photos the user
shared (side-on, three-quarter, bow-on and a close-up at the pier, one with a
news watermark), looked at only and not stored. Boat names, the funnel star
emblem and the watermark are not copied.

The Clock Tower rebuild (user request, 2026-10-01) uses web photos of the
tower the user shared from several angles, by day and at night, some from
stock libraries with watermarks. They were looked at only (to measure
proportions and read the details) and not stored or traced. Watermarks,
signage and logos on the buildings behind the tower are not copied; the dial
numerals are drawn in a system serif font.

The IFC, Observation Wheel and Central Ferry Piers rebuild (user request,
2026-10-02) uses ten web photos the user shared (IFC by day, at dusk and at
night, two from Tsim Sha Tsui; the wheel at night from below), some from stock
libraries with watermarks and one with promo text. They were looked at only,
to measure proportions and read the details, and not stored or traced.
Watermarks, promo text, bank logos, building signage and the wheel's sponsor
banners are not copied.

The promenade pass (user request, 2026-10-02) uses images the user made with
an AI image tool, in `docs/references/foreground/generated/`: a stone
balustrade with a lantern (`promenade-railing-v1.png`), a cast-iron lamp
(`promenade-lamp-v1.png`), a wet paving strip (`wet-paving-strip-v1.png`),
plus a ferry bow fragment and harbour spray not used yet. They are design
references only: the railing, lamps and paving are built in code, and the
images are never shipped or used as textures. The tool and its terms are
to be recorded here if any image is ever imported.

## Asset approval gates

1. Grey-box camera approval comes before final modelling.
2. Every production asset gets a source URL/file, creator, licence, and date in
   this ledger before import.
3. Test each new 3D model (built in code) alone in the browser before
   integrating it into the world.
4. Test alpha cutouts against both light and dark backgrounds at desktop and
   mobile scale.
5. A new asset must replace a named placeholder or solve a documented visual
   problem; otherwise it waits until polish.

**Status:** Phase A approved for the grey-box milestone (2026-10-01). Phase B
and C budgets are recommendations; sources and final asset choices remain open.
