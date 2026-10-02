# Asset Integration Blueprint

**Status:** Planning document for review. Do not integrate these assets until
the foreground / atmosphere milestone begins.

This blueprint maps the generated artwork to the approved six-chapter camera
path. It does not assume that every generated image must ship. The current
grey-box already builds the Bauhinia, palms, railings, lamps, ferry, junk,
landmarks, water reflections and basic firework markers in code. An image asset
should enter production only when it improves the approved composition without
duplicating a code-built object.

## 1. Integration principles

1. Preserve the approved camera poses and copy-safe regions. Assets adapt to the
   composition; the camera is not re-authored to accommodate decoration.
2. Prefer world-anchored cards for scenery and camera-facing sprites for effects.
   Avoid screen-fixed decoration except the HTML interface.
3. A cutout must either replace a named code placeholder or solve a visible
   depth, atmosphere or realism problem.
4. Do not show every foreground asset in every chapter. Near layers should fade
   before crossing copy or obscuring the next chapter's subject.
5. Mobile is separately authored. A desktop foreground layer may be hidden on
   mobile when it reduces landmark clarity.
6. Keep the PNG files as source masters. Production imports use the staged WebP
   versions after final sizing and compression.
7. Integrate one asset family at a time and compare it against the approved
   desktop and mobile storyboard before continuing.

## 2. Recommended disposition of the generated assets

| Asset | Recommended status | Intended use | Reason |
|---|---|---|---|
| `bauhinia-petal-v1.webp` | **Direct-use candidate** | Replace the canvas-drawn petal texture used by `createPetals.js` and the tree's falling petals | Improves the site's recurring signature particle without changing composition |
| `bauhinia-flower-cluster-v1.webp` | **Conditional accent** | One close flower cluster near the upper-right edge of desktop Hero / 01 | Adds near depth; use only if the code-built tree does not already fill this role |
| `bauhinia-tree-v1.webp` | **Replacement candidate** | Replace the code-built tree only after an A/B test | The code tree has real parallax and flutter; the card has richer detail but flatter motion |
| `bauhinia-trunk-branches-v1.webp` | **Hold** | Possible rear card if the tree is rebuilt as layered 2.5D artwork | Do not combine with the current procedural trunk unless silhouettes align exactly |
| `promenade-railing-v1.webp` | **Reference / fallback** | Visual reference for the existing 3D railing | The railing turns corners and changes perspective; a flat card would break during camera travel |
| `promenade-lamp-v1.webp` | **Reference / fallback** | Visual reference for existing 3D lamps | Existing lamps occupy world space and provide consistent parallax |
| `wet-paving-strip-v1.webp` | **Conditional material source** | Chapter 01–02 promenade surface | Use only if adapted into a perspective-correct or tileable material; do not place as a screen strip |
| `ferry-bow-fragment-v1.webp` | **Hold** | Optional near card in 03 if the code ferry lacks intimacy | Never show beside a mismatched second ferry bow |
| `harbour-spray-v1.webp` | **Direct-use candidate** | Camera-facing card attached near the ferry waterline in 03; optional smaller instance by the junk in 04 | Adds speed without duplicating vessel geometry |
| `firework-burst-v1.webp` | **Direct-use candidate** | Replace the four ring markers in 06 | The current marker positions already match the approved composition |
| `smoke-wisps-v1.webp` | **Direct-use candidate** | Two or three slowly drifting cards behind the 06 fireworks | Supports the afterglow and gives the bursts a short visual history |
| `firework-embers-v1.webp` | **Direct-use candidate** | Sparse sprite instances below active bursts in 06 | Adds decay and falling motion at low cost |
| `coral-clouds-v1.webp` | **Direct-use candidate** | Distant sky card in 01 and a dimmer, higher version in 06 | Matches the storyboard's coral-lit cloud atmosphere |
| `harbour-mist-v1.webp` | **Direct-use candidate** | Low-opacity bands between water, mountains and skyline in 01–05 | Separates depth layers without adding geometry |
| `water-reflections-v1.webp` | **Reference / fallback** | Reference for the existing procedural water glints | The code already follows IFC, tower, ferry and junk dynamically; a static plate should be used only if that effect fails visually |

## 3. Proposed production locations

No files should move during the current grey-box milestone. At integration time,
approved and optimized copies should use this structure:

```text
public/
  cutouts/
    bauhinia-petal.webp
    bauhinia-flower-cluster.webp        # conditional
    bauhinia-tree.webp                  # replacement only
    harbour-spray.webp
  atmosphere/
    firework-burst.webp
    firework-smoke.webp
    firework-embers.webp
    coral-clouds.webp
    harbour-mist.webp
  textures/
    wet-paving.webp                     # only after material preparation
```

Reference-only and rejected variants remain under `docs/references/` and are
never loaded by the finished website.

## 4. Layer model

The scene should use four visual depth bands:

| Band | Typical content | Behaviour |
|---|---|---|
| Near foreground | Large petals, optional flower cluster, rare spray droplets | Strongest parallax; fades early during chapter transitions |
| Foreground | Promenade objects, tree, ferry spray | World anchored; may occlude scenery but never approved copy |
| Midground | Vessels, skyline, lower mist | Existing scene objects; normal fog and depth testing |
| Atmosphere / sky | Clouds, upper mist, fireworks, smoke and embers | Camera-facing cards; no depth writing; gentle independent drift |

Use soft alpha edges. Transparent cards should normally disable depth writing
while retaining depth testing. Give each effect family a stable draw order so
overlapping transparent cards do not flicker. Avoid large glowing rectangles:
the alpha edge must disappear against both dark sky and bright fireworks.

## 5. Chapter-by-chapter composition

### Hero and 01 — Harbour at Dusk

**Desktop**

- Keep the current code-built Bauhinia framing the upper-right edge.
- First test only the new petal texture. Retain the existing near / far petal
  counts and wind direction.
- The optional flower cluster may enter from the upper-right edge, occupying no
  more than roughly 18% of viewport width. It must not touch the upper-left copy,
  IFC, junk sail or 香港 wordmark.
- Add one distant coral cloud band above the skyline at low opacity. It should
  move more slowly than the mountains.
- Add one faint mist band immediately above the horizon. It must not wash out
  the Clock Tower silhouette.
- Do not add the generated railing or lamp cards; the existing 3D versions own
  those roles.

**Mobile**

- Preserve the approved open-water composition: no Bauhinia, railing or paving
  card in 01.
- Use fewer far petals and at most one very faint cloud band.
- Keep the upper-centre copy and the space around the wordmark clear.

**Transition to 02**

- Near petals and any flower-cluster card fade before the camera reaches the
  Clock Tower portrait.
- Cloud and mist remain, moving slowly enough that the transition feels
  continuous.

### 02 — The Kowloon Edge

**Desktop**

- Keep the code-built railing, lamps and palms. They must retain true parallax
  around the Clock Tower.
- The WebP railing and lamp remain visual references only.
- Wet paving may be tested as a world-space promenade material after it has been
  made tileable or perspective-correct. Reflections should be subtle and must
  not compete with the clock face.
- One low mist band may sit over the distant water, never across the tower.

**Mobile**

- Maintain the full-width top copy band and centred tower.
- No near flower cluster. Palm and railing silhouettes stay below the copy band.
- Avoid bright paving reflections near the bottom if they pull attention away
  from the tower.

**Transition to 03**

- Promenade foreground fades before the ferry becomes the hero.
- A brief wake or reflected-light cue can begin at the far-right / lower edge,
  but the mobile 02 hold still shows no vessel.

### 03 — Across the Water

**Desktop and mobile**

- The code-built Star Ferry remains the only visible ferry body.
- Attach `harbour-spray.webp` close to the ferry waterline. It follows the ferry
  transform but remains camera-facing.
- Use one principal spray card and, if necessary, one smaller duplicate with a
  different crop, scale and timing. Avoid a repeating tiled pattern.
- Fade spray opacity toward the far end of the card and when the ferry is nearly
  stationary at the chapter hold.
- Keep all spray below the midpoint of the frame and away from the upper-left
  copy.
- Do not introduce `ferry-bow-fragment.webp` unless a later review finds the
  code ferry insufficiently intimate. If used, it replaces part of the visible
  code ferry rather than appearing as a second bow.
- A narrow mist band can sit behind the ferry and in front of the island
  skyline, preserving IFC clarity.

**Transition to 04**

- Ferry spray decreases as the ferry exits.
- The mist survives the crossing and becomes slightly denser near the junk.

### 04 — Red Sails

**Desktop and mobile**

- The code-built junk is the sole hero. Do not add a sail-edge card by default;
  the approved frame does not require one.
- A small, lower-opacity instance of the harbour spray may follow the hull if it
  improves contact with the water.
- Keep petals sparse enough that none cross the main red sail or copy.
- Mist remains behind the junk, never in front of the sail.

**Transition to 05**

- Spray, petals and vessel-adjacent mist fade as the camera rises toward IFC.
- The skyline atmosphere becomes the dominant layer.

### 05 — City of Light

**Desktop and mobile**

- Preserve IFC and the Observation Wheel as the two clear subjects.
- Use one or two extremely subtle mist bands between the water, waterfront
  podiums and tower field. IFC's crown must stay sharp.
- Keep the current procedural water reflections. Use the generated reflection
  sheet only as a visual reference unless the dynamic glints fail review.
- Do not place near foreground cutouts in front of the wheel or IFC.
- Existing reduced petal density may remain, but petals should not read as a
  new subject.

**Transition to 06**

- City motion calms. Mist and reflections dim while the camera pulls back and
  tilts upward.
- Smoke may begin faintly before the first complete firework burst appears.

### 06 — Afterglow

**Desktop**

- Replace each ring marker with an instance of `firework-burst.webp`, preserving
  the positions and approximate sizes already authored in `chapters.js`.
- Tint or color-grade duplicated bursts into warm, coral and cyan families in
  the material. Rotate and mirror duplicates so repetition is not obvious.
- Place smoke behind the bursts. Two or three wisps are enough; each drifts
  horizontally and fades more slowly than the corresponding burst.
- Place sparse ember instances below active bursts. Embers fall and fade; they
  must not enter the left-side copy region.
- A dark coral cloud band can sit below the main bursts, leaving the broad dark
  copy field uninterrupted.

**Mobile**

- Use fewer elements: two dominant bursts, one smaller fading burst, one smoke
  wisp and a restrained ember count.
- Keep the upper-left / left-centre copy region clear.
- Preserve IFC's crown at the bottom as the only strong architectural anchor.

**Reduced motion**

- Show static burst states with no scale animation.
- Smoke and embers remain still or use a very short crossfade.
- Avoid animated flicker.

## 6. Motion specification

| Asset family | Motion | Suggested range |
|---|---|---|
| Petals | Existing fall, spin and scroll gust | Preserve current timing; replace texture first |
| Harbour spray | Slight scale / opacity pulse tied to vessel speed | No more than 5–8% scale change; never loop visibly |
| Clouds | Slow lateral drift | About 1–2% of viewport width per chapter |
| Mist | Slow drift in the opposite direction from clouds | About 0.5–1% of viewport width per chapter |
| Firework burst | Fast reveal, gentle expansion, longer fade | Roughly 0.2 s reveal, 1.2–2 s fade |
| Smoke | Slow expansion and sideways drift | 3–5 s fade |
| Embers | Downward drift with slight sideways variation | 1.5–3 s lifetime |

Motion values are starting points, not requirements. The final test is visual
comfort on the iPhone 11 at 30 fps.

## 7. Loading and performance budget

- Do not preload every image at page start.
- Preload Hero / 01 essentials only. Begin loading 03–04 effects after the page
  is interactive and load 06 effects before the user reaches 05.
- Reuse textures and duplicate meshes or sprites; never upload the same image
  to the GPU multiple times.
- Use one material per tint family where practical.
- Final texture dimensions should match their largest on-screen use at the
  maximum supported pixel ratio; do not ship the current source dimensions by
  default.
- Initial targets after final sizing:
  - single petal: under 100 KB;
  - harbour spray: under 250 KB;
  - firework burst: under 250 KB;
  - smoke / mist sheet: under 300 KB each;
  - cloud sheet: under 350 KB.
- Mobile may use the same files if GPU memory and frame rate pass. Create
  smaller mobile variants only when measurement shows a need.
- Cap pixel ratio and particle counts before removing core composition assets.

## 8. Integration order and review gates

1. **Petal texture only.** Replace the procedural petal drawing and compare
   Hero / 01 / 05 on desktop and mobile.
2. **Harbour spray.** Test 03 first, then decide whether 04 benefits from a
   smaller duplicate.
3. **Cloud and mist.** Introduce one card at a time and check copy contrast and
   landmark silhouettes across 01–05.
4. **Firework burst.** Replace the 06 marker discs without changing their
   approved composition.
5. **Smoke and embers.** Add only after the firework replacement passes.
6. **Conditional assets.** A/B test the flower cluster, full tree card, paving
   material and ferry-bow fragment only if a documented visual problem remains.
7. **Fallback posters.** Capture and author them after all six final scene holds
   are approved.

Each step must pass:

- desktop storyboard comparison at 1440 × 900;
- portrait comparison at 390 × 844 and layout check at 414 × 896;
- copy contrast and no-overlap check;
- reduced-motion check;
- iPhone 11 Safari target of approximately 30 fps;
- transparent-edge inspection against both dark and bright backgrounds.

## 9. Approved integration decisions

Approved 2026-10-02. Use the hybrid approach: procedural systems provide
world-space structure, camera response and motion; selected WebP artwork adds
organic detail and atmosphere.

1. **Bauhinia:** retain the procedural 3D tree. Replace the canvas-drawn petal
   texture with `bauhinia-petal-v1.webp` during the foreground milestone. Keep
   the full tree, trunk and flower-cluster images staged as references or later
   A/B-test material; they do not replace the tree by default.
2. **Ferry:** retain the code-built ferry as the sole vessel. Keep the generated
   bow fragment staged and do not integrate it unless a later visual review
   documents a specific close-up problem.
3. **Water:** retain the procedural reflection system so IFC, the Clock Tower,
   moon, ferry and junk reflections stay aligned and moving. Keep the generated
   reflection sheet as a visual reference only.
4. **Chapter 04:** preserve the approved clean junk composition without an
   additional sail-edge card. The code-built junk and optional subtle harbour
   spray provide sufficient depth.

These decisions close the asset-strategy review. No additional foreground
asset decision is required before the current grey-box work finishes.
