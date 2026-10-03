# Current Atmosphere System

This is a compact reference for the atmosphere already in the site. Historical
experiments and detailed capture records belong in version history, not in the
active plan.

Future priorities are in
[atmospheric-depth-polish.md](atmospheric-depth-polish.md).

## Visual direction

The site should feel like a humid, cinematic Victoria Harbour evening:

- deep violet sky with restrained coral warmth;
- clear silhouettes and one leading subject per chapter;
- separated foreground, middle distance and skyline;
- slow atmospheric motion that is felt rather than watched;
- dark gaps between lights and effects;
- no heavy rain, full-screen fog or decorative effect overload.

## Current systems

### Clouds

- Each chapter has its own overlapping cloud composition rather than repeated
  horizontal strips.
- A dim back layer provides the ceiling; a warmer front layer provides volume.
- Clouds drift slowly and hold still in reduced-motion mode.
- Moonlight and fireworks can tint nearby cloud edges.
- Chapter 06 deliberately leaves more open dark sky for fireworks.

### Harbour mist and depth haze

- Shore mist sits around the Central waterfront with gaps around IFC and the
  observation wheel.
- Sparse open-water wisps support scenes 01 and the harbour approach.
- One depth-haze band separates boats from the distant waterfront in scenes
  01–04.
- Haze is absent from scenes 05–06 so the arrival and fireworks remain clear.
- Do not add more haze layers; the existing system is sufficient.

### Aerial perspective

- The fog takes the sky dome's colour along each view ray, so distant ridges
  and towers pale into the plum horizon glow instead of going dark; below
  the horizon it keeps the old fog colour, so the water is unchanged
  (user choice, 2026-10-04).
- A depth fade behind Central's front row makes the skyline recede in
  planes: 0 at 1220 m north (IFC stays crisp) to 55% at 1920 m, a third
  less on tower tops (user request, 2026-10-04).
- `src/scene/aerialFog.js`; `?off=aerial` restores the old fog.
- Approved 2026-10-04 (user approval).

### Searchlights

- Searchlights support scenes 01 and 05 only.
- IFC does not emit a beam, so its crown remains the primary landmark light.
- Phones use fewer or weaker beams.
- Searchlights disappear before the fireworks chapter.

### Fireworks

- Chapter 06 uses a deterministic eight-second show with warm-white and coral
  as the main colours and cyan as a small accent.
- Rockets, sparks and restrained smoke are already implemented.
- The left and right sides are balanced without covering the copy, moon or IFC.
- Reduced motion holds a composed still moment.

### Chapter 02 afterglow

- A muted rose afterglow warms the low sky to the right of the Clock Tower.
- It fades smoothly outside chapter 02 and is reflected by the water.

### Light breathing

- Promenade halos, the Clock Tower floodlight and vessel lights currently have
  a subtle deterministic 3–4% variation.
- City windows, IFC, the moon and interface remain stable.
- `?off=light-motion` holds the lights at their base values.
- This feature is still unapproved. Do not expand it; remove or disable it if
  its benefit is not apparent in a normal five-second view.

### Deliberately absent

- no large bow spray;
- no continuous mist belt;
- no rain or drizzle;
- no animated grain, paper texture or halftone;
- no global flicker;
- no extra foreground effect in every chapter.

## Chapter roles

| Scene | Main subject | Atmospheric support |
|---|---|---|
| 01 | Harbour panorama | cloud ceiling, sparse mist, faint searchlights |
| 02 | Clock Tower | afterglow, palms, limited mist |
| 03 | Star Ferry | wake, water glints, distant haze |
| 04 | Junk boat | sail silhouette, restrained clouds and shore mist |
| 05 | IFC and wheel | clear arrival view, reflections, searchlights |
| 06 | Fireworks | dark sky, burst-lit clouds and light smoke |

## Non-negotiable constraints

- Keep copy, navigation, the Clock Tower face, IFC crown and vessel silhouettes
  clear.
- Use deterministic animation; never sample visible randomness each frame.
- Reduced motion must remain a complete composed still frame.
- Do not compensate for a weak effect by adding another effect.
- Prefer removing clutter to increasing opacity or brightness.
- Do not change cameras or vessel routes during atmosphere work.

## Main implementation locations

- `src/data/atmosphere.js` — atmosphere settings and authored placements
- `src/scene/createAtmosphere.js` — clouds, mist and haze
- `src/scene/createSearchlights.js` — searchlight beams
- `src/scene/createFireworks.js` — fireworks, sparks and smoke
- `src/data/chapters.js` — per-chapter visibility and composition
- `src/scene/lightBreath.js` — experimental light breathing

Useful comparison switches:

- `?off=haze`
- `?off=mist`
- `?off=beams`
- `?off=light-motion`

## Review policy

For a local atmosphere change, capture one desktop before/after pair for the
affected scene. Add one mobile after image only when mobile is affected. Record
a transition only when motion or fading changed. Do not produce full chapter
capture sets or contact sheets by default.
